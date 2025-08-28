import ast
import glob
import json
import os
import uuid
from fastapi import APIRouter, UploadFile, File, Depends, Request, HTTPException, Header, Body
from pathlib import Path

from starlette.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from .API.API_Deepseek import single_matching, multiple_matching
from .API.API_Lykdat import img_detect

router = APIRouter()

#读取数据
# try:
#     with open("json_file/auth.json", "r", encoding="utf-8") as f:
#         allusers = json.load(f)
# except:
#     print('读取用户数据出错')
# try:
#     with open("json_file/token.json", "r", encoding="utf-8") as f:
#         alltokens = json.load(f)
# except:
#     print('读取token数据出错')



@router.post("/upload")
async def upload_cloth(file: UploadFile = File(...)):
    contents = await file.read()
    cloth_id = str(uuid.uuid4())

    img_dir = Path(f"json_file/users/img")
    img_dir.mkdir(parents=True, exist_ok=True)

    # 保留原始扩展名
    suffix = Path(file.filename).suffix
    img_path = img_dir / f"{cloth_id}{suffix}"

    with open(img_path, "wb") as f:
        f.write(contents)
    tags = img_detect(img_path, cloth_id)
    _save_new_cloth(cloth_id, suffix, tags)
    return "successfully added!"

@router.post("/singlematching")
async def single_matching_cloth(request: Request):
    print("matching(s)...")
    data = await request.json()
    try:
        inputrequirements = data.get("inputrequirements", "")
        user_clothes = data.get("clothes", [])

        if not user_clothes:
            return {"error": "No clothes selected."}

        # 只取第一个 cloth_id（因为用户只选一件）
        cloth_id = user_clothes[0]["cloth_id"]

        # 直接读取 clothes.json
        clothes_path = Path("json_file/users/clothes.json")
        if not clothes_path.exists():
            return {"error": "No clothes data found."}

        with open(clothes_path, "r", encoding="utf-8") as f:
            user_clothes = json.load(f)

        if not user_clothes:
            return {"error": "No clothes data found."}

        # deepseek 模型调用
        result = {
            "user_cloth": cloth_id,
            "other_clothes": user_clothes,
            "inputrequirements": inputrequirements
        }

        deepseek_response = single_matching(str(result), str(inputrequirements))
        deepseek_response_inlist = ast.literal_eval(deepseek_response)

        all_images = []
        for pairs in deepseek_response_inlist:
            for cloth_id in pairs:
                # 直接从 img 文件夹匹配图片
                img_pattern = f"json_file/users/img/{cloth_id}*"
                img_files = glob.glob(img_pattern)
                if img_files:
                    img_url = f"user_images/img/{os.path.basename(img_files[0])}"
                    all_images.append(img_url)
        return {"images": all_images}

    except Exception as e:
        print("error", e)
        return {"衣服匹配失败": str(e)}



@router.post("/multipulmatching")
async def multipul_matching_cloth(request: Request):
    print("matching(m)...")
    data = await request.json()
    try:
        inputrequirements = data.get("inputrequirements", "")

        # 直接读取 clothes.json
        clothes_path = Path("json_file/users/clothes.json")
        if not clothes_path.exists():
            return {"error": "No clothes data found."}

        with open(clothes_path, "r", encoding="utf-8") as f:
            user_clothes = json.load(f)

        if not user_clothes:
            return {"error": "No clothes data found."}

        # 调用 matching API
        deepseek_response = multiple_matching(str(user_clothes), str(inputrequirements))
        deepseek_response_inlist = ast.literal_eval(deepseek_response)

        all_images = []
        for pairs in deepseek_response_inlist:
            for cloth_id in pairs:
                # 直接从 img 文件夹匹配图片
                img_pattern = f"json_file/users/img/{cloth_id}*"
                img_files = glob.glob(img_pattern)
                if img_files:
                    img_url = f"user_images/img/{os.path.basename(img_files[0])}"
                    all_images.append(img_url)
        return {"images": all_images}

    except Exception as e:
        return {"衣服匹配失败": str(e)}



@router.get("/showuserclothes")
def show_user_clothes():
    import ast
    clothes_list = _get_clothes_json()
    result = []
    for cloth in clothes_list:
        cloth_info = cloth.get("cloth_info", {})
        img = cloth_info.get("img", "/public/default.png")
        tags = cloth_info.get("tags", [])

        if isinstance(tags, str):
            try:
                tags = ast.literal_eval(tags)
                if not isinstance(tags, list):
                    tags = []
            except:
                tags = []

        result.append({
            "cloth_id": cloth.get("cloth_id"),
            "img": img,
            "tags": tags
        })

    return JSONResponse(content=result)


def _get_clothes_img(cloth_id):
    img_pattern = f"json_file/users/img/{cloth_id}*"
    img_files = glob.glob(img_pattern)
    if not img_files:
        img_url = "/public/default.png"
    else:
        img_url = f"/user_images/img/{os.path.basename(img_files[0])}"
    clothes_file = "json_file/users/clothes.json"
    with open(clothes_file, "r") as f:
        content = json.load(f)
    item_info = next((item for item in content if item.get("cloth_id") == cloth_id), None)
    return {"info": item_info, "img": img_url}


def _get_clothes_json():
    clothes_path = Path("json_file/users/clothes.json")
    if not clothes_path.exists():
        return []
    with open(clothes_path, "r", encoding="utf-8") as f:
        try:
            content = json.load(f)
        except json.JSONDecodeError:
            content = []
    return content



def _save_new_cloth(cloth_id, suffix, tags):
    import ast
    if isinstance(tags, str):
        try:
            tags = ast.literal_eval(tags)
            if not isinstance(tags, list):
                tags = []
        except:
            tags = []

    clothes_path = Path("json_file/users/clothes.json")
    if clothes_path.exists():
        with open(clothes_path, "r", encoding="utf-8") as f:
            try:
                user_clothes = json.load(f)
            except json.JSONDecodeError:
                user_clothes = []
    else:
        user_clothes = []

    new_cloth = {
        "cloth_id": str(cloth_id),
        "cloth_info": {
            "img": f"/user_images/img/{cloth_id}{suffix}",
            "tags": str(tags)
        }
    }
    user_clothes.append(new_cloth)

    with open(clothes_path, "w", encoding="utf-8") as f:
        json.dump(user_clothes, f, ensure_ascii=False, indent=4)
