from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Department, Employee, Contract


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ["code", "name"]
    search_fields = ["name", "code"]


@admin.register(Employee)
class EmployeeAdmin(UserAdmin):
    list_display = ["username", "name", "role", "department", "is_active"]
    list_filter = ["role", "department", "is_active"]
    fieldsets = UserAdmin.fieldsets + (
        ("Профиль", {"fields": ("name", "role", "department")}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ("Профиль", {"fields": ("name", "role", "department")}),
    )


@admin.register(Contract)
class ContractAdmin(admin.ModelAdmin):
    list_display = ["id", "name", "status", "consumer_type", "department", "responsible", "date"]
    list_filter = ["status", "consumer_type", "department"]
    search_fields = ["name", "address", "responsible", "inn"]
    date_hierarchy = "date"
