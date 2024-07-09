"""
URL configuration for StudentV4BE project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

from django.conf.urls.static import static
from django.conf import settings
from student import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('students/', views.get_student), # 获取所有学生信息的接口
    path('students/query/', views.query_student), # 搜索学生
    path('sno/check/', views.is_exsits_sno), # 通过学号查看学生是否存在
    path('student/add/', views.add_student), #添加学生接口
    path('student/update/', views.update_student), #修改学生接口
    path('student/delete/', views.del_student), #单个删除学生接口
    path('students/delete/', views.del_students), #批量删除学生接口
    path('upload/', views.upload), #学生头像上传
    path('import/',views.excel_import), # 导入
    path('export/',views.excel_export), # 导出
]

# 允许所有media文件被访问
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)