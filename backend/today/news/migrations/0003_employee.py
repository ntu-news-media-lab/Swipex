# Generated by Django 3.1.4 on 2021-03-25 14:50

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('news', '0002_auto_20210322_1639'),
    ]

    operations = [
        migrations.CreateModel(
            name='Employee',
            fields=[
                ('emp_no', models.IntegerField(primary_key=True, serialize=False)),
                ('user_id', models.CharField(max_length=255)),
                ('has_read', models.ForeignKey(db_column='dept_no', on_delete=django.db.models.deletion.CASCADE, to='news.news')),
            ],
        ),
    ]
