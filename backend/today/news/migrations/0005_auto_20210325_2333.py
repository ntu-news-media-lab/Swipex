# Generated by Django 3.1.4 on 2021-03-25 15:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('news', '0004_auto_20210325_2253'),
    ]

    operations = [
        migrations.AlterField(
            model_name='news',
            name='news_id',
            field=models.AutoField(primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='reader',
            name='reader_no',
            field=models.AutoField(primary_key=True, serialize=False),
        ),
    ]