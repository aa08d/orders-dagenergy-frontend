from django.db.models import Q, Count
from django.utils import timezone
from rest_framework import viewsets, filters, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Department, Employee, Contract
from .serializers import DepartmentSerializer, EmployeeSerializer, ContractSerializer


# ── Auth ──────────────────────────────────────────────────────────────────────

@api_view(["POST"])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get("username", "")
    password = request.data.get("password", "")
    try:
        user = Employee.objects.get(username__iexact=username)
    except Employee.DoesNotExist:
        return Response({"detail": "Неверный логин или пароль."}, status=status.HTTP_401_UNAUTHORIZED)
    if not user.check_password(password):
        return Response({"detail": "Неверный логин или пароль."}, status=status.HTTP_401_UNAUTHORIZED)
    if not user.is_active:
        return Response({"detail": "Учётная запись отключена."}, status=status.HTTP_403_FORBIDDEN)
    refresh = RefreshToken.for_user(user)
    return Response({
        "access": str(refresh.access_token),
        "refresh": str(refresh),
        "user": {
            "id": user.id,
            "username": user.username,
            "name": user.name,
            "role": user.role,
            "departmentId": user.department_id,
            "isAdmin": user.is_admin,
        },
    })


@api_view(["POST"])
@permission_classes([AllowAny])
def refresh_view(request):
    from rest_framework_simplejwt.views import TokenRefreshView
    return TokenRefreshView.as_view()(request._request)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me_view(request):
    user = request.user
    return Response({
        "id": user.id,
        "username": user.username,
        "name": user.name,
        "role": user.role,
        "departmentId": user.department_id,
        "isAdmin": user.is_admin,
    })


# ── Departments ───────────────────────────────────────────────────────────────

class DepartmentViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Department.objects.all().order_by("code")
    serializer_class = DepartmentSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = None


# ── Contracts ─────────────────────────────────────────────────────────────────

class ContractViewSet(viewsets.ModelViewSet):
    serializer_class = ContractSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ["id", "name", "status", "date", "responsible", "consumer_type"]
    ordering = ["-id"]

    def get_queryset(self):
        user = self.request.user
        qs = Contract.objects.select_related("department", "created_by")

        if not user.is_admin and user.department_id:
            qs = qs.filter(department_id=user.department_id)

        search = self.request.query_params.get("search")
        if search:
            qs = qs.filter(
                Q(name__icontains=search) |
                Q(address__icontains=search) |
                Q(responsible__icontains=search)
            )

        status_f = self.request.query_params.get("status")
        if status_f:
            qs = qs.filter(status=status_f)

        consumer_type = self.request.query_params.get("consumer_type")
        if consumer_type:
            qs = qs.filter(consumer_type=consumer_type)

        consumer_category = self.request.query_params.get("consumer_category")
        if consumer_category:
            qs = qs.filter(consumer_category=consumer_category)

        # tasks=1 → договора ожидающие действий: Новая (у специалиста) или Согласование (у менеджера)
        tasks = self.request.query_params.get("tasks")
        if tasks == "1":
            if user.role == "Менеджер" or user.is_admin:
                # Менеджер видит договора на согласовании
                qs = qs.filter(status="Согласование")
            else:
                # Специалист видит свои новые договора
                qs = qs.filter(status="Новая")

        return qs

    # ── Upload scan + send to approval ────────────────────────────────────────
    @action(detail=True, methods=["post"], url_path="upload-scan",
            parser_classes=[MultiPartParser, FormParser])
    def upload_scan(self, request, pk=None):
        contract = self.get_object()

        if contract.status not in ("Новая",):
            return Response(
                {"detail": "Скан можно загружать только для договора со статусом 'Новая'."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        scan = request.FILES.get("scan")
        if not scan:
            return Response({"detail": "Файл не передан."}, status=status.HTTP_400_BAD_REQUEST)

        contract.scan_file = scan
        contract.scan_uploaded_at = timezone.now()
        contract.scan_uploaded_by = request.user
        contract.status = "Согласование"
        contract.save()

        return Response(ContractSerializer(contract, context={"request": request}).data)

    # ── Approve ───────────────────────────────────────────────────────────────
    @action(detail=True, methods=["post"], url_path="approve")
    def approve(self, request, pk=None):
        contract = self.get_object()
        user = request.user

        if not (user.role in ("Менеджер", "Администратор") or user.is_admin):
            return Response({"detail": "Недостаточно прав."}, status=status.HTTP_403_FORBIDDEN)

        if contract.status != "Согласование":
            return Response(
                {"detail": "Можно согласовать только договор со статусом 'Согласование'."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        contract.status = "В работе"
        contract.rejection_reason = ""
        contract.save()

        return Response(ContractSerializer(contract, context={"request": request}).data)

    # ── Reject ────────────────────────────────────────────────────────────────
    @action(detail=True, methods=["post"], url_path="reject")
    def reject(self, request, pk=None):
        contract = self.get_object()
        user = request.user

        if not (user.role in ("Менеджер", "Администратор") or user.is_admin):
            return Response({"detail": "Недостаточно прав."}, status=status.HTTP_403_FORBIDDEN)

        if contract.status != "Согласование":
            return Response(
                {"detail": "Можно отклонить только договор со статусом 'Согласование'."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        reason = request.data.get("reason", "")
        contract.status = "Отклонена"
        contract.rejection_reason = reason
        contract.save()

        return Response(ContractSerializer(contract, context={"request": request}).data)

    # ── Stats ─────────────────────────────────────────────────────────────────
    @action(detail=False, methods=["get"], url_path="stats")
    def stats(self, request):
        year  = int(request.query_params.get("year",  0) or 0)
        month = int(request.query_params.get("month", 0) or 0)

        user = request.user
        qs = Contract.objects.all()
        if not user.is_admin and user.department_id:
            qs = qs.filter(department_id=user.department_id)
        if year:
            qs = qs.filter(date__year=year)
        if month:
            qs = qs.filter(date__month=month)

        total = qs.count()
        by_status = {}
        for row in qs.values("status").annotate(cnt=Count("id")):
            by_status[row["status"]] = row["cnt"]

        by_dept = []
        for dept in Department.objects.all():
            dept_qs = qs.filter(department=dept)
            dept_status = {}
            for row in dept_qs.values("status").annotate(cnt=Count("id")):
                dept_status[row["status"]] = row["cnt"]
            by_dept.append({
                "id": dept.id, "name": dept.name, "code": dept.code,
                "total": dept_qs.count(), "byStatus": dept_status,
            })

        by_emp = []
        for emp in Employee.objects.all():
            emp_qs = qs.filter(created_by=emp)
            emp_status = {}
            for row in emp_qs.values("status").annotate(cnt=Count("id")):
                emp_status[row["status"]] = row["cnt"]
            by_emp.append({
                "id": emp.id, "name": emp.name, "role": emp.role,
                "total": emp_qs.count(), "byStatus": emp_status,
            })

        return Response({
            "total": total, "byStatus": by_status,
            "byDept": by_dept, "byEmp": by_emp,
        })
