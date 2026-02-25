from rest_framework import serializers
from .models import Department, Employee, Contract


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ["id", "name", "code"]


class EmployeeSerializer(serializers.ModelSerializer):
    departmentId = serializers.PrimaryKeyRelatedField(
        source="department", queryset=Department.objects.all(), allow_null=True, required=False
    )

    class Meta:
        model = Employee
        fields = ["id", "username", "name", "role", "departmentId", "is_admin"]
        read_only_fields = ["id", "is_admin"]


class ContractSerializer(serializers.ModelSerializer):
    departmentId = serializers.PrimaryKeyRelatedField(
        source="department", queryset=Department.objects.all(), allow_null=True, required=False
    )
    consumerType     = serializers.CharField(source="consumer_type")
    consumerCategory = serializers.CharField(source="consumer_category")
    representativeName  = serializers.CharField(source="representative_name",  required=False, allow_blank=True)
    representativePhone = serializers.CharField(source="representative_phone", required=False, allow_blank=True)
    passportSeries     = serializers.CharField(source="passport_series",     required=False, allow_blank=True)
    passportNumber     = serializers.CharField(source="passport_number",     required=False, allow_blank=True)
    passportIssuedBy   = serializers.CharField(source="passport_issued_by",  required=False, allow_blank=True)
    passportIssuedDate = serializers.DateField(source="passport_issued_date", required=False, allow_null=True)
    bankName    = serializers.CharField(source="bank_name",    required=False, allow_blank=True)
    bankBik     = serializers.CharField(source="bank_bik",     required=False, allow_blank=True)
    bankAccount = serializers.CharField(source="bank_account", required=False, allow_blank=True)
    smsPhone     = serializers.CharField(source="sms_phone",     required=False, allow_blank=True)
    contactPhone = serializers.CharField(source="contact_phone", required=False, allow_blank=True)
    chiefAccountant      = serializers.CharField(source="chief_accountant",       required=False, allow_blank=True)
    chiefAccountantPhone = serializers.CharField(source="chief_accountant_phone", required=False, allow_blank=True)
    responsibleEpu      = serializers.CharField(source="responsible_epu",       required=False, allow_blank=True)
    responsibleEpuPhone = serializers.CharField(source="responsible_epu_phone", required=False, allow_blank=True)
    createdBy       = serializers.PrimaryKeyRelatedField(source="created_by", read_only=True)
    rejectionReason = serializers.CharField(source="rejection_reason", read_only=True)
    scanUploadedAt  = serializers.DateTimeField(source="scan_uploaded_at", read_only=True)
    date = serializers.DateField()

    # Returns a full absolute URL instead of a bare relative path
    scanFile = serializers.SerializerMethodField()

    def get_scanFile(self, obj):
        if not obj.scan_file:
            return None
        request = self.context.get("request")
        if request:
            return request.build_absolute_uri(obj.scan_file.url)
        return obj.scan_file.url

    class Meta:
        model = Contract
        fields = [
            "id", "name", "address", "consumerType", "consumerCategory",
            "status", "date", "responsible", "departmentId",
            "representativeName", "representativePhone",
            "inn", "kpp",
            "passportSeries", "passportNumber", "passportIssuedBy", "passportIssuedDate",
            "bankName", "bankBik", "bankAccount",
            "smsPhone", "contactPhone",
            "chiefAccountant", "chiefAccountantPhone",
            "responsibleEpu", "responsibleEpuPhone",
            "createdBy", "rejectionReason", "scanFile", "scanUploadedAt",
        ]
        read_only_fields = ["id", "createdBy", "rejectionReason", "scanFile", "scanUploadedAt"]

    def create(self, validated_data):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            validated_data["created_by"] = request.user
        return super().create(validated_data)
