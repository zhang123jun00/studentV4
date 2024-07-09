from django.test import TestCase

# Create your tests here.
import openpyxl,os

def read_excel_students(path):
    workbook = openpyxl.load_workbook(path)
    sheet = workbook['student']
    students = []
    keys = ['sno', 'name', 'gender', 'birthday', 'mobile', 'email', 'address']
    for row in sheet.rows:
        temp_dict = {}
        for index, cell in enumerate(row):
            temp_dict[keys[index]] = cell.value
        students.append(temp_dict)
    return students

if __name__ == '__main__':
    basePath = os.path.dirname(os.path.dirname(__file__))
    excelPath = os.path.join(basePath, 'excel')
    stuPath = os.path.join(excelPath, 'students.xlsx')
    print(read_excel_students(stuPath))
    # path = ''
    # read_excel_students()