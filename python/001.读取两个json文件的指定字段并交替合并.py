# 完全利用 chat.openai.com 没有什么修改
# 2023/03/05 21:34
# 用于将 ai_subtiltle 中的 content字段 交叉读取两个文件中的某一相同字段并存入文件
import json

# 使用utf-8编码方式打开第一个包含JSON数据的文件并读取内容
with open('subtitle_data1.json', 'r', encoding='utf-8') as f:
    subtitle_json1 = f.read()

# 解析JSON字符串为Python字典
subtitle_data1 = json.loads(subtitle_json1)

# 使用utf-8编码方式打开第二个包含JSON数据的文件并读取内容
with open('subtitle_data2.json', 'r', encoding='utf-8') as f:
    subtitle_json2 = f.read()

# 解析JSON字符串为Python字典
subtitle_data2 = json.loads(subtitle_json2)

# 将两个字幕数据的content值交替添加到一个名为contents的列表中
contents = []
max_length = max(len(subtitle_data1['body']), len(subtitle_data2['body']))
for i in range(max_length):
    if i < len(subtitle_data1['body']):
        contents.append(subtitle_data1['body'][i]['content'])
    if i < len(subtitle_data2['body']):
        contents.append(subtitle_data2['body'][i]['content'])

# 使用utf-8编码方式打开输出文件并将contents中的内容按照顺序写入该文件中，每个内容后添加一个换行符
with open('output.txt', 'w', encoding='utf-8') as f:
    for content in contents:
        f.write(content + '\n')
