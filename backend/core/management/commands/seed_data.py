"""
python manage.py seed_data

Creates departments and employees from mock data.
"""
from django.core.management.base import BaseCommand
from core.models import Department, Employee


DEPARTMENTS = [
    {"name": "Махачкалинское отделение", "code": "001"},
    {"name": "Дербентское отделение",    "code": "002"},
    {"name": "Каспийское отделение",     "code": "003"},
    {"name": "Хасавюртовское отделение", "code": "004"},
]

EMPLOYEES = [
    {"username": "admin",   "password": "admin123",   "name": "Джамалудин Алисултанов", "role": "Администратор", "dept_code": "001", "is_superuser": True},
    {"username": "manager", "password": "manager123", "name": "Анна Смирнова",           "role": "Менеджер",      "dept_code": "001"},
    {"username": "ivanov",  "password": "ivanov123",  "name": "Иванов П.С.",             "role": "Менеджер",      "dept_code": "002"},
    {"username": "kozlova", "password": "kozlova123", "name": "Козлова Е.В.",            "role": "Специалист",    "dept_code": "002"},
    {"username": "novikov", "password": "novikov123", "name": "Новиков Д.М.",            "role": "Специалист",    "dept_code": "003"},
    {"username": "petrov",  "password": "petrov123",  "name": "Петров К.О.",             "role": "Менеджер",      "dept_code": "003"},
    {"username": "sidorov", "password": "sidorov123", "name": "Сидоров А.Н.",            "role": "Специалист",    "dept_code": "004"},
]


class Command(BaseCommand):
    help = "Seed initial departments and employees"

    def handle(self, *args, **options):
        dept_map = {}
        for d in DEPARTMENTS:
            obj, created = Department.objects.get_or_create(code=d["code"], defaults={"name": d["name"]})
            dept_map[d["code"]] = obj
            self.stdout.write(f"{'Created' if created else 'Exists'} department: {obj}")

        for e in EMPLOYEES:
            dept = dept_map.get(e["dept_code"])
            if not Employee.objects.filter(username=e["username"]).exists():
                emp = Employee(
                    username=e["username"],
                    name=e["name"],
                    role=e["role"],
                    department=dept,
                    is_superuser=e.get("is_superuser", False),
                    is_staff=e.get("is_superuser", False),
                )
                emp.set_password(e["password"])
                emp.save()
                self.stdout.write(f"Created employee: {emp}")
            else:
                self.stdout.write(f"Exists employee: {e['username']}")

        self.stdout.write(self.style.SUCCESS("Seeding complete."))
