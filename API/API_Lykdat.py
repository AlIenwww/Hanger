import requests
import uuid
from pprint import pprint
from clothes_matching_.API.apikeys import API_Lykdat


url = 'https://cloudapi.lykdat.com/v1/detection/tags'
headers = {
    'x-api-key': API_Lykdat,
}

def img_detect(img_path, cloth_id):
    # 使用 with 自动关闭文件
    with open(img_path, 'rb') as image_file:
        files = [
            ('image', ('image.jpg', image_file, 'image/jpeg'))
        ]
        response = requests.post(url, files=files, headers=headers)

    # 直接用 response.json() 解析
    raw_data = response.json()
    # 打印原始响应
    print(response.content)

    # 获取 data 字段
    data = raw_data.get("data", {})

    # 创建结构化字典
    item_dict = {
        "cloth_id": cloth_id,
        "colors": [color.get("name") for color in data.get("colors", [])],
        "clothes": [item.get("name") for item in data.get("items", [])],
        "tags": {}
    }
    # item_dict = {
    #     "cloth_id": str(uuid.uuid4()),
    #     "colors": [color.get("name") for color in data.get("colors", [])],
    #     "clothes": [item.get("name") for item in data.get("items", [])],
    #     "tags": {}
    # }

    for label in data.get("labels", []):
        classification = label.get("classification", "other")
        if classification not in item_dict["tags"]:
            item_dict["tags"][classification] = []
        item_dict["tags"][classification].append(label.get("name"))
    structured_list = [item_dict]
    pprint(structured_list)
    return str(structured_list)


# 调用示例
# tags = img_detect("../json_file/users/test.png", '1')
# print('tags')
# print(tags)
