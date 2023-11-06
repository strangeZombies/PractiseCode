# integrated_code.py
from PIL import Image
from io import BytesIO
import os
import http.cookiejar as cookielib
import qrcode
import random
from fake_useragent import UserAgent
from qrcode_terminal import draw  # Import for Linux
import requests
import sqlite3
from datetime import datetime, timezone, timedelta
from time import sleep as time_sleep

## 注意事项
### 不要过量使用本脚本，注意防止被短暂封禁
### 三个月以外浏览数据在远端不保存，本脚本用于永久保存数据
### 使用方法：手动将扫码获取到的sessiondata填入cookies

## 一定修改
### Replace '26...' with your actual SESSDATA value
cookies = {'SESSDATA': '26'}

## 按需更改
daily_time = 1 # 脚本执行间隔时间（单位：天）
#re_check = 0 # 数据维护（不建议开启）0:关闭 1:开启 3:清者（配合keepWhile使用）
### 网络不好时修改
retry_limit = 3  # 重试次数限制
skip_limit = 3  # 连续跳过次数限制
### 如果脚本异常中断，使用以便一直获取数据直到最后
keepWhile = 1 #  0:关闭 1:开启 2:无数据（自动）

## 不要修改
url = 'https://api.bilibili.com/x/web-interface/history/cursor' # 历史记录获取api
initial_params = {'ps': '30', 'max': '0', 'view_at': '0', 'type': 'all'} # 历史记录获取api初识参数

## ======================================================= ##

def save_login_info(username, login_status, cookies):
    # 插入登录信息到表中
    cursor.execute('''
        INSERT INTO bilibili_login_info (username, login_status, cookies)
        VALUES (?, ?, ?)
    ''', (username, login_status, cookies))
    conn.commit()

class ShowPng:
    def __init__(self, data):
        self.data = data

    def show(self):
        try:
            if os.name == 'posix':  # Check if the OS is Linux
                img = Image.open(BytesIO(self.data))
                draw(img)  # Display ASCII art on Linux
            elif os.name == 'nt':  # Check if the OS is Windows
                img_path = 'temp_qr_code.png'
                with open(img_path, 'wb') as img_file:
                    img_file.write(self.data)
                os.system(f'start {img_path}')  # Open the image with the default viewer on Windows
        except Exception as e:
            print("Displaying image:")
            print(repr(self.data))

# agent.py
def get_user_agents():
    user_agent = UserAgent()
    return user_agent.random

# bzlogin.py
def is_login(session):
    try:
        session.cookies.load(ignore_discard=True)
    except Exception:
        pass

    login_url = session.get("https://api.bilibili.com/x/web-interface/nav", verify=False, headers=headers).json()

    if login_url['code'] == 0:
        print('Cookies值有效，', login_url['data']['uname'], '，已登录！')
        return session, True
    else:
        print('Cookies值已经失效，请重新扫码登录！')
        return session, False

def bz_login():
    if not os.path.exists('bzcookies.txt'):
        with open("bzcookies.txt", 'w') as f:
            f.write("")

    session = requests.session()
    session.cookies = cookielib.LWPCookieJar(filename='bzcookies.txt')
    session, status = is_login(session)

    if not status:
        get_login = session.get('https://passport.bilibili.com/qrcode/getLoginUrl', headers=headers).json()
        login_url = requests.get(get_login['data']['url'], headers=headers).url
        oauth_key = get_login['data']['oauthKey']

        qr = qrcode.QRCode(box_size=10)
        qr.add_data(login_url)
        img = qr.make_image()
        qr.print_ascii(out=None,tty=False,invert=False)
        a = BytesIO()
        img.save(a, 'png')
        png = a.getvalue()
        a.close()

        viewer = ShowPng(png)
        viewer.show()

        token_url = 'https://passport.bilibili.com/qrcode/getLoginInfo'
        while True:
            qr_code_data = session.post(token_url, data={'oauthKey': oauth_key, 'gourl': 'https://www.bilibili.com/'}, headers=headerss).json()
            print(qr_code_data)

            if '-4' in str(qr_code_data['data']):
                print('二维码未失效，请扫码！')
            elif '-5' in str(qr_code_data['data']):
                print('已扫码，请确认！')
            elif '-2' in str(qr_code_data['data']):
                print('二维码已失效，请重新运行！')
                break
            elif 'True' in str(qr_code_data['status']):
                print('已确认，登入成功！')
                session.get(qr_code_data['data']['url'], headers=headers)
                break
            else:
                print('其他：', qr_code_data)

            time_sleep(2)

        print(session.cookies)
        session.cookies.save()

    return session

def connect_to_database():
    # 连接本地 SQLite 数据库
    conn = sqlite3.connect('bili_data.db')
    cursor = conn.cursor()

    # 检查是否已存在表
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS bilibili_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            cover TEXT,
            author_name TEXT,
            author_face TEXT,
            view_at INTEGER,
            tag_name TEXT,
            bvid TEXT,
            oid TEXT, 
            business TEXT, 
            part TEXT, 
            badge TEXT, 
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS bilibili_login_info (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT,
            login_status TEXT,
            cookies TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    return conn, cursor

def get_latest_created_at(cursor,keepWhile=keepWhile,daily_time=daily_time):
    # 获取最新记录的 created_at 字段
    latest_record = cursor.execute('''
        SELECT created_at FROM bilibili_history
        ORDER BY created_at DESC
        LIMIT 1
    ''').fetchone()

    if latest_record:
        # 将字符串转换为 datetime 对象
        latest_created_at = datetime.strptime(latest_record[0], '%Y-%m-%d %H:%M:%S')

        # 计算最早和最晚时间戳
        latest_fetch = int(latest_created_at.timestamp())
        oldest_fetch = int((latest_created_at - timedelta(days=daily_time)).timestamp())

        print(f"本次获取应该是从 {latest_fetch} 开始")
    else:
        keepWhile = 2
        latest_fetch = 0
        oldest_fetch = 0
        print("数据库中没有记录")

    return latest_fetch, oldest_fetch

def save_login_info(username, login_status, cookies):
    # 创建数据库连接
    conn, cursor = connect_to_database()

    # 插入登录信息到表中
    cursor.execute('''
        INSERT INTO bilibili_login_info (username, login_status, cookies)
        VALUES (?, ?, ?)
    ''', (username, login_status, cookies))
    conn.commit()

    # 关闭数据库连接
    conn.close()

def fetch_bilibili_history(keepWhile=keepWhile,skip_limit=skip_limit,retry_limit=retry_limit):
    # 创建数据库连接
    conn, cursor = connect_to_database()

    # 获取最新记录的 created_at 字段
    latest_fetch, oldest_fetch = get_latest_created_at(cursor,keepWhile=keepWhile)
    # 开始循环获取 
    skip_count = 0 # 连续跳过计数器   
    while True:
        # 发送 GET 请求到 Bilibili API，并添加自动重试逻辑
        retry_count = 0
        while retry_count < retry_limit:
            try:
                response = requests.get(
                    url, params=initial_params, cookies=cookies)
                response.raise_for_status()  # 检查网络请求是否成功
                break
            except requests.exceptions.RequestException as e:
                retry_count += 1
                print(f"获取数据失败。正在重试 {retry_count}/{retry_limit} 次...")
                print(f"错误信息: {e}")
                sleep(2)

        # 检查是否成功获取数据
        if retry_count == retry_limit or response.status_code != 200:
            print(f"{retry_count} 次重试后仍然无法获取数据。退出程序。")
            break

        # 如果连续跳过次数超过限制，停止循环
        if skip_count >= skip_limit:
            print('结束')
            break

        # 检查 API 返回的 code 值
        api_code = response.json().get('code', -400)  # 默认为 -400，表示请求错误
        if api_code == 0:
            conf = response.json()['data']['cursor']
            data = response.json()['data']['list']
            # 本次获取的第一组
            if initial_params['max'] == '0' and initial_params['view_at'] == '0':
                print('====开始循环获取浏览历史====')
            else:
                for item in data:
                    # 取出符合条件的数据，去除重复
                    if item['view_at'] > latest_fetch or keepWhile == 2 or keepWhile == 1:
                        if item['view_at'] > latest_fetch:
                            selected_data = cursor.execute('''
                                SELECT DISTINCT bvid, author_name, view_at FROM bilibili_history
                                WHERE bvid = ? AND author_name = ? AND view_at BETWEEN ? AND ?
                                ORDER BY view_at DESC
                            ''', (item['history']['bvid'], item['author_name'], oldest_fetch, latest_fetch)).fetchall()
                        if keepWhile == 1 or keepWhile == 2:
                            selected_data = cursor.execute('''
                                SELECT DISTINCT bvid, author_name, view_at FROM bilibili_history
                                WHERE bvid = ? AND author_name = ? 
                                ORDER BY view_at DESC
                            ''', (item['history']['bvid'], item['author_name'])).fetchall()
                        if selected_data:
                            if keepWhile == 1:
                                skip_count = 0
                                # 跳过已有数据
                            else:
                                if skip_count <= skip_limit:
                                    skip_count += 1
                        else:
                            if skip_count <= skip_limit:
                                skip_count = 0
                            #print('插入新记录') 
                            # 插入新记录
                            cursor.execute('''
                                INSERT OR IGNORE INTO bilibili_history (title, cover, author_name, author_face, view_at, tag_name, bvid, oid, business, part, badge, created_at)
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                            ''', (
                                item['title'],
                                item['cover'],
                                item['author_name'],
                                item['author_face'],
                                item['view_at'],
                                item['tag_name'],
                                item['history']['bvid'],
                                item['history']['oid'],
                                item['history']['business'],
                                item['history']['part'],
                                item['badge'],
                                datetime.fromtimestamp(item['view_at'], timezone(timedelta(hours=8))).strftime('%Y-%m-%d %H:%M:%S')
                            ))
                    else:
                        print('已经是最新的数据')
                        skip_count = skip_limit
                        break

                # 提交更改
                conn.commit()

            # 更新参数，继续下一轮请求      
            initial_params['max'] = str(conf['max'])
            initial_params['view_at'] = str(conf['view_at'])
        else:
            break
            print(f"API 返回错误代码 {api_code}。正在退出。")

    # 关闭数据库连接
    conn.close()

if __name__ == '__main__':
    headers = {'User-Agent': get_user_agents(), 'Referer': "https://www.bilibili.com/"}
    headerss = {'User-Agent': get_user_agents(), 'Host': 'passport.bilibili.com', 'Referer': "https://passport.bilibili.com/login"}
    if cookies['SESSDATA']:
        fetch_bilibili_history()
    else:
        bz_login()
        print('将获取的session填入脚本开头的cookie中')
