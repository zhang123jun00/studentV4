from django.db import models


# Create your models here.
# Student:学号，姓名，性别，出生日期，手机号码，邮箱地址，家庭地址，照片


class Student(models.Model):
    gender_choice = (('男', '男'), ('女', '女'))
    sno = models.IntegerField(db_column="Sno",
                              primary_key=True,
                              null=False,
                              verbose_name='学号')
    name = models.CharField(db_column="SName",
                            max_length=100,
                            null=False,
                            verbose_name='姓名')
    gender = models.CharField(db_column='Gender',
                              choices=gender_choice,
                              max_length=20,
                              verbose_name='性别')
    birthday = models.DateField(db_column='Birthday',
                                    null=False,
                                    verbose_name='生日')
    mobile = models.CharField(db_column='Mobile',
                              max_length=20,
                              verbose_name='手机号')
    email = models.CharField(db_column='Email',
                             max_length=100,
                             verbose_name='邮箱')
    address = models.CharField(db_column='Address',
                               max_length=200,
                               verbose_name='家庭地址')
    image = models.CharField(db_column='Image',
                             max_length=200,
                             null=True,
                             verbose_name='照片')

    class Meta:
        db_table = 't_student'
        verbose_name_plural = verbose_name = '学生信息表'
        managed = True

    def __str__(self):
        return '学号：%s\t 姓名：%s \t 性别：%s' % (self.sno, self.name, self.gender)
