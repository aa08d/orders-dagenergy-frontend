import django.contrib.auth.models
import django.contrib.auth.validators
import django.db.models.deletion
import django.utils.timezone
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("auth", "0012_alter_user_first_name_max_length"),
    ]

    operations = [
        # ── Department ──────────────────────────────────────────────────────
        migrations.CreateModel(
            name="Department",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=200, verbose_name="Наименование")),
                ("code", models.CharField(max_length=20, unique=True, verbose_name="Код")),
            ],
            options={
                "verbose_name": "Отделение",
                "verbose_name_plural": "Отделения",
                "ordering": ["code"],
            },
        ),

        # ── Employee (custom user) ───────────────────────────────────────────
        migrations.CreateModel(
            name="Employee",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("password", models.CharField(max_length=128, verbose_name="password")),
                ("last_login", models.DateTimeField(blank=True, null=True, verbose_name="last login")),
                ("is_superuser", models.BooleanField(default=False, verbose_name="superuser status")),
                ("username", models.CharField(
                    error_messages={"unique": "A user with that username already exists."},
                    max_length=150,
                    unique=True,
                    validators=[django.contrib.auth.validators.UnicodeUsernameValidator()],
                    verbose_name="username",
                )),
                ("first_name", models.CharField(blank=True, max_length=150, verbose_name="first name")),
                ("last_name", models.CharField(blank=True, max_length=150, verbose_name="last name")),
                ("email", models.EmailField(blank=True, max_length=254, verbose_name="email address")),
                ("is_staff", models.BooleanField(default=False, verbose_name="staff status")),
                ("is_active", models.BooleanField(default=True, verbose_name="active")),
                ("date_joined", models.DateTimeField(default=django.utils.timezone.now, verbose_name="date joined")),
                ("name", models.CharField(max_length=200, verbose_name="ФИО")),
                ("role", models.CharField(
                    choices=[
                        ("Администратор", "Администратор"),
                        ("Менеджер", "Менеджер"),
                        ("Специалист", "Специалист"),
                    ],
                    default="Специалист",
                    max_length=50,
                    verbose_name="Роль",
                )),
                ("groups", models.ManyToManyField(
                    blank=True,
                    related_name="user_set",
                    related_query_name="user",
                    to="auth.group",
                    verbose_name="groups",
                )),
                ("user_permissions", models.ManyToManyField(
                    blank=True,
                    related_name="user_set",
                    related_query_name="user",
                    to="auth.permission",
                    verbose_name="user permissions",
                )),
                ("department", models.ForeignKey(
                    blank=True,
                    null=True,
                    on_delete=django.db.models.deletion.SET_NULL,
                    related_name="employees",
                    to="core.department",
                    verbose_name="Отделение",
                )),
            ],
            options={
                "verbose_name": "Сотрудник",
                "verbose_name_plural": "Сотрудники",
            },
            managers=[
                ("objects", django.contrib.auth.models.UserManager()),
            ],
        ),

        # ── Contract ────────────────────────────────────────────────────────
        migrations.CreateModel(
            name="Contract",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=300, verbose_name="Наименование")),
                ("address", models.CharField(max_length=500, verbose_name="Адрес")),
                ("consumer_type", models.CharField(
                    choices=[
                        ("Юридическое лицо", "Юридическое лицо"),
                        ("Индивидуальный предприниматель", "Индивидуальный предприниматель"),
                        ("Физическое лицо", "Физическое лицо"),
                        ("Частный бытовой сектор", "Частный бытовой сектор"),
                    ],
                    max_length=50,
                    verbose_name="Тип потребителя",
                )),
                ("consumer_category", models.CharField(
                    choices=[
                        ("Прочие потребители", "Прочие потребители"),
                        ("Население городское", "Население городское"),
                        ("Население сельское", "Население сельское"),
                        ("Приравненные к городскому населению", "Приравненные к городскому населению"),
                        ("Приравненные к сельскому населению", "Приравненные к сельскому населению"),
                    ],
                    max_length=60,
                    verbose_name="Категория",
                )),
                ("status", models.CharField(
                    choices=[
                        ("Новая", "Новая"),
                        ("В работе", "В работе"),
                        ("Согласование", "Согласование"),
                        ("Завершена", "Завершена"),
                        ("Отклонена", "Отклонена"),
                    ],
                    default="Новая",
                    max_length=20,
                    verbose_name="Статус",
                )),
                ("date", models.DateField(verbose_name="Дата")),
                ("responsible", models.CharField(max_length=200, verbose_name="Ответственный")),
                ("representative_name", models.CharField(blank=True, max_length=200, verbose_name="Представитель")),
                ("representative_phone", models.CharField(blank=True, max_length=30, verbose_name="Телефон представителя")),
                ("inn", models.CharField(blank=True, max_length=20, verbose_name="ИНН")),
                ("kpp", models.CharField(blank=True, max_length=20, verbose_name="КПП")),
                ("passport_series", models.CharField(blank=True, max_length=10, verbose_name="Серия паспорта")),
                ("passport_number", models.CharField(blank=True, max_length=20, verbose_name="Номер паспорта")),
                ("passport_issued_by", models.CharField(blank=True, max_length=300, verbose_name="Кем выдан")),
                ("passport_issued_date", models.DateField(blank=True, null=True, verbose_name="Дата выдачи паспорта")),
                ("bank_name", models.CharField(blank=True, max_length=200, verbose_name="Банк")),
                ("bank_bik", models.CharField(blank=True, max_length=20, verbose_name="БИК")),
                ("bank_account", models.CharField(blank=True, max_length=30, verbose_name="Расчётный счёт")),
                ("sms_phone", models.CharField(blank=True, max_length=30, verbose_name="Телефон для SMS")),
                ("contact_phone", models.CharField(blank=True, max_length=30, verbose_name="Контактный телефон")),
                ("chief_accountant", models.CharField(blank=True, max_length=200, verbose_name="Главный бухгалтер")),
                ("chief_accountant_phone", models.CharField(blank=True, max_length=30, verbose_name="Телефон гл. бухгалтера")),
                ("responsible_epu", models.CharField(blank=True, max_length=200, verbose_name="Ответственный ЭПУ")),
                ("responsible_epu_phone", models.CharField(blank=True, max_length=30, verbose_name="Телефон ЭПУ")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("department", models.ForeignKey(
                    blank=True,
                    null=True,
                    on_delete=django.db.models.deletion.SET_NULL,
                    related_name="contracts",
                    to="core.department",
                    verbose_name="Отделение",
                )),
                ("created_by", models.ForeignKey(
                    blank=True,
                    null=True,
                    on_delete=django.db.models.deletion.SET_NULL,
                    related_name="contracts_created",
                    to=settings.AUTH_USER_MODEL,
                    verbose_name="Создал",
                )),
            ],
            options={
                "verbose_name": "Договор",
                "verbose_name_plural": "Договоры",
                "ordering": ["-created_at"],
            },
        ),
    ]
