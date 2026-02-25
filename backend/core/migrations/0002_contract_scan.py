import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="contract",
            name="scan_file",
            field=models.FileField(blank=True, null=True, upload_to="contract_scans/", verbose_name="Скан договора"),
        ),
        migrations.AddField(
            model_name="contract",
            name="scan_uploaded_at",
            field=models.DateTimeField(blank=True, null=True, verbose_name="Дата загрузки скана"),
        ),
        migrations.AddField(
            model_name="contract",
            name="scan_uploaded_by",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="scans_uploaded",
                to=settings.AUTH_USER_MODEL,
                verbose_name="Загрузил скан",
            ),
        ),
        migrations.AddField(
            model_name="contract",
            name="rejection_reason",
            field=models.TextField(blank=True, verbose_name="Причина отклонения"),
        ),
    ]
