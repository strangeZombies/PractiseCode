import json
import psycopg

connection = psycopg.connect("host=localhost dbname=postgres user=postgres")
cursor = connection.cursor()

data = json.load(open('20220415.json', 'r', encoding='utf-8'))

fields = [
    'history'
]
flds = [
    'title', 'long_title', 'cover', 'covers', 'uri', "videos",
    "author_name", "author_face", "author_mid", "view_at", "progress", "badge", "show_title",
    "duration", "current", "total", "new_desc", "is_finish", "is_fav", "kid", "tag_name", "live_status"
]
historys = [
    'oid', 'epid', 'bvid', 'page', 'cid', 'part', 'business', 'dt'
]
final = []
for item in data:
    my_data = [item[field] for field in fields]
    my_fld = [item[fld] for fld in flds]
    for k, v in enumerate(my_fld):
        if isinstance(v, dict):
            my_fld[k] = json.dumps(v)
        # print(my_fld)
    # bh表对应字段见 flds
    insert_query = "INSERT INTO bh VALUES ( %s  ,%s ,%s ,%s ,%s ,%s ,%s ,%s ,%s ,%s ,%s ,%s ,%s ,%s ,%s ,%s ,%s ,%s ,%s ,%s ,%s ,%s) "
    cursor.execute(insert_query, tuple(my_fld))    

    for im in my_data:
        my_history=[im[history] for history in historys]

        for key, value in enumerate(my_history):
            if isinstance(value, dict):
                my_history[key]=json.dumps(value)
        # print(my_history)
    #bhc表对应字段见 historys
    insert_query = "INSERT INTO bhc (oid,epid,bvid,page,cid,part,business,dt) VALUES (%s ,%s ,%s ,%s ,%s ,%s ,%s ,%s ) "
    cursor.execute(insert_query, tuple(my_history))    



connection.commit()
connection.close()

print('done')
