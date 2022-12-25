import psycopg2
import os
import json
import pandas
from dotenv import load_dotenv


def to_path(l, folder, extension):
    return os.path.join(folder, l + extension)



def load_course():
    with open('course_type.json') as f:
        data = json.load(f)
    return data['type']

def html2xlsx(course):
    for i in course:
        tmp = pandas.read_html(to_path(i, 'raw','.xls'))[0]
        tmp.to_excel(to_path(i, 'result', '.xlsx'))
        

def main():


    #convert all html table in raw/ to xlsx file in result/
    course_name = load_course()
    html2xlsx(course_name)

    #connect to psql server
    conn = psycopg2.connect(database = "test", user="postgres", password="admin", host="localhost", port = "5432") 
    cur = conn.cursor()


    #update psql for eacg course
    for i in course['type']:
        update_db(cur, i)

    conn.close()



if __name__ == '__main__':
    main()