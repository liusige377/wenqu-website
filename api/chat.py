# -*- coding: utf-8 -*-
"""
问渠AI助手 - Vercel Serverless Function
/api/chat
"""
import os
import json
import urllib.request
import time

ZHIPU_KEY = os.environ.get("ZHIPU_KEY", "")

def handler(request):
    """Vercel Python Function 入口"""
    # 处理 CORS 预检请求
    if request.method == "OPTIONS":
        return {"statusCode": 204, "headers": cors_headers()}

    # 读取请求体
    try:
        body = request.get_data(as_text=True)
        data = json.loads(body) if body else {}
    except:
        data = {}

    user_message = data.get("message", "")

    if not user_message:
        return {
            "statusCode": 400,
            "headers": cors_headers_json(),
            "body": json.dumps({"success": False, "error": "消息不能为空"}, ensure_ascii=False)
        }

    # 调用智谱AI
    result = call_zhipu(user_message)

    return {
        "statusCode": 200,
        "headers": cors_headers_json(),
        "body": json.dumps(result, ensure_ascii=False)
    }

def cors_headers():
    return {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

def cors_headers_json():
    return {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
    }

def call_zhipu(message):
    """调用智谱AI GLM-4-Flash"""
    if not ZHIPU_KEY:
        return {"success": False, "error": "API密钥未配置"}

    url = "https://open.bigmodel.cn/api/paas/v4/chat/completions"
    payload = json.dumps({
        "model": "glm-4-flash",
        "messages": [{"role": "user", "content": message}]
    }, ensure_ascii=False).encode("utf-8")

    req = urllib.request.Request(url, data=payload, headers={
        "Authorization": f"Bearer {ZHIPU_KEY}",
        "Content-Type": "application/json"
    })

    start = time.time()
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            result = json.loads(resp.read())
        elapsed = time.time() - start
        content = result["choices"][0]["message"]["content"]
        return {
            "success": True,
            "provider": "问渠AI",
            "model": "问渠AI",
            "content": content,
            "elapsed": round(elapsed, 2)
        }
    except Exception as e:
        return {"success": False, "error": f"请求失败：{str(e)[:100]}"}
