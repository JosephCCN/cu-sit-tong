import psycopg2
import os
import json
import pandas
import sys
import xlwings
from dotenv import load_dotenv


def to_path(name, folder, extension):
    return os.path.join(folder, name + extension)

#find the cell that is not empty from row in col
def find_next_non_empty_cell(sheet, row, col):
    while sheet.range(f'A{row}').value != None:
        if sheet.range(f'{col}{row}').value != None:
            return row
        row+=1
    return -1

#find key from row in col
def find_keyword(sheet, row, col, key):
    while sheet.range(f'A{row}').value != None:
        if sheet.range(f'{col}{row}').value == key:
            return row
        row+=1
    return -1

def find_week_from_sheet(str):
    return str[:2]

#accept a 12-hr time format string and convert into 24-hr time format
def hr12tohr24(str):
    hr = int(str[:2])
    min = str[3] + str[4]
    if str[-2:] == 'PM' and hr != 12:
        hr += 12
    return ('%2d:%s' % (hr, min))

#accept a string time format and convert it into minutes
def time_to_min(str):
    return int(str[:2]) * 60 + int(str[-2:])    

def find_time_from_sheet(str):
    time_part = str[3:] #extract last part of the string, except the first 3 char
    start_time = time_part[:7] #extract the first 7 char, i.e. start time
    end_time = time_part[-7:] #extract the last 7 char, i.e. end time
    start_time_24 = hr12tohr24(start_time)
    end_time_24 = hr12tohr24(end_time)
    return time_to_min(start_time_24), time_to_min(end_time_24)

def convert_week_term(str):
    dict = {'Mo': 'Monday', 'Tu': 'Tuesday', 'We': 'Wednesday', 'Th': 'Thursday', 'Fr': 'Friday'}
    return dict[str]

#update psql server
def update_db(cur, name):
    app = xlwings.App(visible=False)
    path = to_path(name, 'result', '.xlsx')
    wb = app.books.open(path)
    sheet = wb.sheets['Sheet1']
    row = 2
    while row > 1:
        r = find_next_non_empty_cell(sheet, row + 1, 'I') 
        info = set()
        course_code = sheet.range(f'B{row}').value
        if course_code[-1] == '-':
            course_code = course_code[:-1]
        print(course_code)
        taught_by = sheet.range(f'F{row}').value[2:]
        for i in range(row, r):
            time = sheet.range(f'L{i}').value
            week = find_week_from_sheet(time)
            week_full = convert_week_term(week)
            start_time, end_time = find_time_from_sheet(time) 
            location = sheet.range(f'M{i}').value
            info.add((course_code, location, start_time, end_time, week_full, taught_by))
        
        #insert info into psql
        for i in info:
            cur.execute('insert into course values (%s, %s, %s, %s, %s, %s);', (i[0], i[1], i[2], i[3], i[4], i[5]))

        row = find_keyword(sheet, row + 1, 'I', 'LEC')

        #print bar
        print('#', end='')


    wb.close()




def load_course():
    with open('course_type.json') as f:
        data = json.load(f)
    return data['type']

def html2xlsx(course):
    for i in course:
        tmp = pandas.read_html(to_path(i, 'raw','.xls'))[0]
        tmp.to_excel(to_path(i, 'result', '.xlsx'))
        

def main():


    course_name = load_course()

    #convert all html table in raw/ to xlsx file in result/ if convert option is added
    if len(sys.argv) >= 2 and sys.argv[1] == 'convert':
        html2xlsx(course_name)



    #connect to psql server
    conn = psycopg2.connect(database = "test", user="postgres", password="admin", host="localhost", port = "5432") 
    cur = conn.cursor()


    #update psql for eacg course
    for i in course_name:
        print(i)
        update_db(cur, i)

    x = input('Are you sure to commit all changes? (yes/no)')
    if x == 'yes':
        conn.commit()
    cur.close()
    conn.close()



if __name__ == '__main__':
    main()