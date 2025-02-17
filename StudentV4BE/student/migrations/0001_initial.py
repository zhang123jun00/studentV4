# Generated by Django 4.2.13 on 2024-06-13 03:11

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Student',
            fields=[
                ('sno', models.IntegerField(db_column='Sno', primary_key=True, serialize=False, verbose_name='学号')),
                ('name', models.CharField(db_column='SName', max_length=100, verbose_name='姓名')),
                ('gender', models.CharField(choices=[('男', '男'), ('女', '女')], db_column='Gender', max_length=20, verbose_name='性别')),
                ('birthday', models.DateTimeField(db_column='Birthday', verbose_name='生日')),
                ('mobile', models.CharField(db_column='Mobile', max_length=20, verbose_name='手机号')),
                ('email', models.CharField(db_column='Email', max_length=100, verbose_name='邮箱')),
                ('address', models.CharField(db_column='Address', max_length=200, verbose_name='家庭地址')),
                ('image', models.CharField(db_column='Image', max_length=200, null=True, verbose_name='照片')),
            ],
            options={
                'verbose_name': '学生信息表',
                'verbose_name_plural': '学生信息表',
                'db_table': 't_student',
                'managed': True,
            },
        ),
    ]
