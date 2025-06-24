import json
import requests
import os

# JSON 파일 로드
with open('musinsa_colors.json', 'r', encoding='utf-8') as f:
    colors = json.load(f)

# 저장 폴더 생성
os.makedirs('color_images', exist_ok=True)

# ID 시작값
start_id = 101

# 이미지 다운로드 및 저장
for idx, color in enumerate(colors):
    color_id = start_id + idx
    name_en = color['color_name_en'].replace(' ', '_')
    url = color['color_image_url']
    filename = f"{color_id}_{name_en}.png"
    filepath = os.path.join('color_images', filename)
    try:
        response = requests.get(url)
        response.raise_for_status()
        with open(filepath, 'wb') as f:
            f.write(response.content)
        print(f"✅ Saved: {filename}")
    except Exception as e:
        print(f"❌ Failed to save {filename}: {e}")