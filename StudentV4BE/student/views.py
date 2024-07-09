import hashlib
import uuid

from django.core.files.storage import FileSystemStorage
from django.http import JsonResponse
from django.core.files.uploadedfile import InMemoryUploadedFile
# Create your views here.
from student.models import Student
import json
from django.db.models import Q
from django.views.decorators.csrf import csrf_exempt
import os
from django.conf import settings
from uitls.common import read_excel_import,get_random_str,write_to_excel





def get_student(request):
    '''获取所有学生信息'''
    try:
        # 获取所有学生的信息
        obj_student = Student.objects.all().values()
        # 把结果转换为list
        students = list(obj_student)
        # 返回json
        return JsonResponse({'code': 1, 'data': students})
    except Exception as e:
        return JsonResponse({'code': 0, 'msg': f'获取学生信息出现异常，具体错误{e}'})


@csrf_exempt
def query_student(request):
    '''
    查询学生信息
    接收传递过来的查询条件--axios默认是json,字典类型inputstr , data['inputstr']


    :param request:
    :return:
    '''
    data = json.loads(request.body.decode('utf-8'))
    try:
        obj_students = Student.objects.filter(Q(sno__icontains=data['inputstr']) |
                                              Q(name__icontains=data['inputstr']) |
                                              Q(gender__icontains=data['inputstr']) |
                                              Q(email__icontains=data['inputstr']) |
                                              Q(address__icontains=data['inputstr']) |
                                              Q(mobile__icontains=data['inputstr'])
                                              ).values()
        students = list(obj_students)

        return JsonResponse({'code': 1, 'data': students})

    except Exception as e:
        return JsonResponse({'code': 0, 'msg': f'查询结果有误，具体原因{e}'})


@csrf_exempt
def is_exsits_sno(request):
    data = json.loads(request.body.decode('utf-8'))
    try:
        obj_students = Student.objects.filter(sno=data['sno'])
        if obj_students.count() == 0:
            return JsonResponse({'code': 1, 'exsits': False})
        else:
            return JsonResponse({'code': 1, 'exsits': True})
    except Exception as e:
        return JsonResponse({'code': 0, 'msg': '校验学号失败，具体原因' + str(e)})


@csrf_exempt
def add_student(request):
    '''添加学生到数据库'''
    data = json.loads(request.body.decode('utf-8'))

    try:
        # 添加到数据库
        object_student = Student(sno=data['sno'],
                                 name=data['name'],
                                 gender=data['gender'],
                                 birthday=data['birthday'],
                                 email=data['email'],
                                 mobile=data['mobile'],
                                 address=data['address'],
                                 image=data['image'])
        object_student.save()
        # 重新获取全部学生

        # 获取所有学生的信息
        obj_students = Student.objects.all().values()
        # 把结果转换为list
        students = list(obj_students)
        # 返回json
        return JsonResponse({'code': 1, 'data': students})
    except Exception as e:
        return JsonResponse({'code': 0, 'msg': '添加到数据库出现异常具体原因：' + str(e)})


@csrf_exempt
def update_student(request):
    data = json.loads(request.body.decode('utf-8'))
    # 查找到学生
    try:
        obj_student = Student.objects.get(sno=data['sno'])
        obj_student.name = data['name']
        obj_student.gender = data['gender']
        obj_student.birthday = data['birthday']
        obj_student.email = data['email']
        obj_student.mobile = data['mobile']
        obj_student.address = data['address']
        obj_student.image = data['image']
        # 保存
        obj_student.save()

        obj_students = Student.objects.all().values()
        students = list(obj_students)
        return JsonResponse({'code': 1, 'data': students})
    except Exception as e:
        return JsonResponse({'code': 0, 'msg': '修改数据库失败，失败原因' + str(e)})


@csrf_exempt
def del_student(request):
    data = json.loads(request.body.decode('utf-8'))
    try:
        obj_stu = Student.objects.get(sno=data['sno'])
        obj_stu.delete()
        obj_students = Student.objects.all().values()
        students = list(obj_students)
        return JsonResponse({'code': 1, 'data': students})
    except Exception as e:
        JsonResponse({'code': 0, 'msg': '调用后端接口失败，失败原因：' + str(e)})


@csrf_exempt
def del_students(request):
    '''批量删除'''
    data = json.loads(request.body.decode('utf-8'))
    try:
        for one_student in data['student']:
            obj_stu = Student.objects.get(sno=one_student['sno'])
            obj_stu.delete()
        obj_students = Student.objects.all().values()
        students = list(obj_students)
        return JsonResponse({'code': 1, 'data': students})
    except Exception as e:
        return JsonResponse({'code': 0, 'msg': '删除数据失败,失败原因' + str(e)})


@csrf_exempt
def upload(request):
    '''接收上传文件'''
    rev_file = request.FILES['avatar']
    print(rev_file)
    # 判断是否有文件
    if not rev_file:
        return JsonResponse({'code': 0, 'msg': "图片不存在"})
    # # 获得唯一的名字
    new_name = get_random_str()
    file_path = os.path.join(settings.MEDIA_ROOT, new_name + os.path.splitext(str(rev_file))[1])
    try:
        f = open(file_path, 'wb')
        for i in rev_file.chunks():
            f.write(i)
        f.close()
        return JsonResponse({
            'code': 1,
            'name': new_name + os.path.splitext(str(rev_file))[1]
        })
    except Exception as e:
        return JsonResponse({'code': 0, 'msg': '错误原因' + str(e)})

@csrf_exempt
def excel_import(request):
    '''接收excel'''
    rev_file = request.FILES.get('file')
    if not rev_file:
        JsonResponse({
            'code':0,
            'msg': '文件未上传'
        })
    new_name = get_random_str()
    file_path = os.path.join(settings.MEDIA_ROOT, new_name + os.path.splitext(str(rev_file))[1])
    try:
        with open(file_path, 'wb') as f:
            for i in rev_file.chunks():
                f.write(i)
    except Exception as e:
        return JsonResponse({
            'code': 0,
            'msg': f'错误原因{e}'
        })
    # 读取存储在media的文件
    ex_students = read_excel_import(file_path)

    # 把读取的数据存储在数据库
    success=0
    error = 0
    error_sno = []
    for one_student in ex_students:
        try:
            obj_student = Student.objects.create(sno=one_student['sno'],
                                  name=one_student['name'],
                                  gender=one_student['gender'],
                                  email=one_student['email'],
                                  mobile=one_student['mobile'],
                                  birthday=one_student['birthday'],
                                  address=one_student['address'])
            obj_student.save()
            success += 1

        except:
            error += 1
            error_sno.append(one_student['sno'])


    # 返回响应
    obj_students = Student.objects.all().values()
    students = list(obj_students)
    return JsonResponse({
        'code': 1,
        'sucess': success,
        'error': error,
        'error_sno': error_sno,
        'data': students
    })


def excel_export(request):
    '''导出数据到Excel'''
    obj_students = Student.objects.all().values()
    students = list(obj_students)
    excel_name = get_random_str() + '.xlsx'
    path = os.path.join(settings.MEDIA_ROOT, excel_name)
    write_to_excel(students, path)
    return JsonResponse({
        'code':1,
        'name': excel_name
    })