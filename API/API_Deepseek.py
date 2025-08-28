from openai import OpenAI
from clothes_matching_.API.apikeys import API_DeepSeek


client = OpenAI(api_key=API_DeepSeek, base_url="https://api.deepseek.com")

single_system = """You are a fashion styling expert, skilled in all types of attractive clothing combinations. Users will send you several Python dictionaries with nested lists, in a template like the content within the single quotes: [{'cloth_id': UUID('8d515ccf-cf80-49a6-8412-ad9f8341819c'), 'clothes': ['outerwear'], 'colors': ['light grey', 'light gray', 'dark gray', 'smokey grey', 'davy\'s grey'], 'tags': {'apparel': ['top'], 'garment parts': ['hood', 'sleeve', 'pocket'], 'length': ['wrist-length', 'above the hip (length)'], 'nickname': ['hoodie', 'kangaroo (pocket)', 'raglan (sleeve)'], 'silhouette': ['symmetrical', 'regular (fit)'], 'textile pattern': ['plain']}}] Identify all attractive combinations from all the 'other clothes' that are suitable for the 'user cloth'. If there are any special styling requirements provided by the user, make sure to follow them. Return the results in the format: [['clothing to style' cloth_id, suitable 'other clothes' cloth_id], 'clothing to style' cloth_id, suitable 'other clothes' cloth_id]... Do not output anything other than the returned data, as this may cause the program to fail. One piece of clothing should not match itself.You don't need to generate a lot, a lot. Just generate some plans that are very suitable and good-looking when combined"""
multipul_system = """You are a fashion styling expert, skilled in all types of attractive clothing combinations. Users will send you several Python dictionaries with nested lists, in a template like the content within the single quotes: [{'cloth_id': UUID('8d515ccf-cf80-49a6-8412-ad9f8341819c'), 'clothes': ['outerwear'], 'colors': ['light grey', 'light gray', 'dark gray', 'smokey grey', 'davy\'s grey'], 'tags': {'apparel': ['top'], 'garment parts': ['hood', 'sleeve', 'pocket'], 'length': ['wrist-length', 'above the hip (length)'], 'nickname': ['hoodie', 'kangaroo (pocket)', 'raglan (sleeve)'], 'silhouette': ['symmetrical', 'regular (fit)'], 'textile pattern': ['plain'] } }}] Identify all attractive combinations from all the "other clothes" sent to you that meet the user’s requirements. If there are special requirements, make sure to follow them. Return the results in the format: [['clothing or pants to style' cloth_id, suitable 'other clothes or pants' cloth_id], 'clothing or pants to style' cloth_id, suitable 'other clothes' cloth_id]... Do not output anything other than the returned data, as this may cause the program to fail. One piece of clothing should not match itself.You don't need to generate a lot, a lot. Just generate some plans that are very suitable and good-looking when combined"""




def single_matching(inputclothes, inputrequirements):
    print('inputinputinput')
    print(inputclothes)
    response = client.chat.completions.create(
        model="deepseek-chat",
        messages=[
            {"role": "system", "content": str(single_system)},
            {"role": "user", "content": f"{inputclothes},Requirements and conditions:{inputrequirements}，The upper garment should be matched with the bottom. If there is no good-looking combination, there is no need to generate it."},
        ],
        stream=False
    )
    response_deepseek = response.choices[0].message.content
    print(f"response{response_deepseek}")
    return response_deepseek


def multiple_matching(inputclothes, inputrequirements):
    print(inputclothes)
    response = client.chat.completions.create(
        model="deepseek-chat",
        messages=[
            {"role": "system", "content": multipul_system},
            {"role": "user", "content": f"{inputclothes},Requirements and conditions:{inputrequirements}，The upper garment should be matched with the bottom. If there is no good-looking combination, there is no need to generate it."},
        ],
        stream=False
    )
    response_deepseek = response.choices[0].message.content
    print(response_deepseek)
    return response_deepseek
