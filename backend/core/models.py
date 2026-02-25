from django.db import models
from django.contrib.auth.models import AbstractUser


class Department(models.Model):
    name = models.CharField(max_length=200, verbose_name="Наименование")
    code = models.CharField(max_length=20, unique=True, verbose_name="Код")

    class Meta:
        verbose_name = "Отделение"
        verbose_name_plural = "Отделения"
        ordering = ["code"]

    def __str__(self):
        return f"{self.code} – {self.name}"


class Employee(AbstractUser):
    ROLE_CHOICES = [
        ("Администратор", "Администратор"),
        ("Менеджер", "Менеджер"),
        ("Специалист", "Специалист"),
    ]
    name = models.CharField(max_length=200, verbose_name="ФИО")
    role = models.CharField(max_length=50, choices=ROLE_CHOICES, default="Специалист", verbose_name="Роль")
    department = models.ForeignKey(
        Department,
        null=True, blank=True,
        on_delete=models.SET_NULL,
        related_name="employees",
        verbose_name="Отделение",
    )

    class Meta:
        verbose_name = "Сотрудник"
        verbose_name_plural = "Сотрудники"

    def __str__(self):
        return self.name or self.username

    @property
    def is_admin(self):
        return self.role == "Администратор" or self.is_superuser


# ── Contract ─────────────────────────────────────────────────────────────────

STATUS_CHOICES = [
    ("Новая", "Новая"),
    ("В работе", "В работе"),
    ("Согласование", "Согласование"),
    ("Завершена", "Завершена"),
    ("Отклонена", "Отклонена"),
]

CONSUMER_TYPE_CHOICES = [
    ("Юридическое лицо", "Юридическое лицо"),
    ("Индивидуальный предприниматель", "Индивидуальный предприниматель"),
    ("Физическое лицо", "Физическое лицо"),
    ("Частный бытовой сектор", "Частный бытовой сектор"),
]

CONSUMER_CATEGORY_CHOICES = [
    ("Прочие потребители", "Прочие потребители"),
    ("Население городское", "Население городское"),
    ("Население сельское", "Население сельское"),
    ("Приравненные к городскому населению", "Приравненные к городскому населению"),
    ("Приравненные к сельскому населению", "Приравненные к сельскому населению"),
]


class Contract(models.Model):
    # Main
    name = models.CharField(max_length=300, verbose_name="Наименование")
    address = models.CharField(max_length=500, verbose_name="Адрес")
    consumer_type = models.CharField(max_length=50, choices=CONSUMER_TYPE_CHOICES, verbose_name="Тип потребителя")
    consumer_category = models.CharField(max_length=60, choices=CONSUMER_CATEGORY_CHOICES, verbose_name="Категория")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Новая", verbose_name="Статус")
    date = models.DateField(verbose_name="Дата")
    responsible = models.CharField(max_length=200, verbose_name="Ответственный")
    department = models.ForeignKey(
        Department,
        null=True, blank=True,
        on_delete=models.SET_NULL,
        related_name="contracts",
        verbose_name="Отделение",
    )
    created_by = models.ForeignKey(
        Employee,
        null=True, blank=True,
        on_delete=models.SET_NULL,
        related_name="contracts_created",
        verbose_name="Создал",
    )

    # Part 3 – representative
    representative_name = models.CharField(max_length=200, blank=True, verbose_name="Представитель")
    representative_phone = models.CharField(max_length=30, blank=True, verbose_name="Телефон представителя")

    # Part 5 – INN/KPP (ЮЛ, ИП)
    inn = models.CharField(max_length=20, blank=True, verbose_name="ИНН")
    kpp = models.CharField(max_length=20, blank=True, verbose_name="КПП")

    # Part 6 – Passport (ФЛ, ЧБС)
    passport_series = models.CharField(max_length=10, blank=True, verbose_name="Серия паспорта")
    passport_number = models.CharField(max_length=20, blank=True, verbose_name="Номер паспорта")
    passport_issued_by = models.CharField(max_length=300, blank=True, verbose_name="Кем выдан")
    passport_issued_date = models.DateField(null=True, blank=True, verbose_name="Дата выдачи паспорта")

    # Part 7 – Bank (ЮЛ, ИП)
    bank_name = models.CharField(max_length=200, blank=True, verbose_name="Банк")
    bank_bik = models.CharField(max_length=20, blank=True, verbose_name="БИК")
    bank_account = models.CharField(max_length=30, blank=True, verbose_name="Расчётный счёт")

    # Part 8 – Contacts
    sms_phone = models.CharField(max_length=30, blank=True, verbose_name="Телефон для SMS")
    contact_phone = models.CharField(max_length=30, blank=True, verbose_name="Контактный телефон")

    # Part 10 – Other
    chief_accountant = models.CharField(max_length=200, blank=True, verbose_name="Главный бухгалтер")
    chief_accountant_phone = models.CharField(max_length=30, blank=True, verbose_name="Телефон гл. бухгалтера")
    responsible_epu = models.CharField(max_length=200, blank=True, verbose_name="Ответственный ЭПУ")
    responsible_epu_phone = models.CharField(max_length=30, blank=True, verbose_name="Телефон ЭПУ")

    # Scan upload (подписанный скан)
    scan_file = models.FileField(
        upload_to="contract_scans/",
        null=True, blank=True,
        verbose_name="Скан договора",
    )
    scan_uploaded_at = models.DateTimeField(null=True, blank=True, verbose_name="Дата загрузки скана")
    scan_uploaded_by = models.ForeignKey(
        "Employee",
        null=True, blank=True,
        on_delete=models.SET_NULL,
        related_name="scans_uploaded",
        verbose_name="Загрузил скан",
    )
    rejection_reason = models.TextField(blank=True, verbose_name="Причина отклонения")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Договор"
        verbose_name_plural = "Договоры"
        ordering = ["-created_at"]

    def __str__(self):
        return f"#{self.pk} – {self.name}"
