from fastapi import FastAPI, Form, Depends, Body, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.requests import Request
from fastapi.staticfiles import StaticFiles

from clothes_matching_.func import router

app = FastAPI()
app.include_router(router)
templates = Jinja2Templates(directory="templates")
app.mount("/public", StaticFiles(directory="templates/public"), name="public")
app.mount("/static", StaticFiles(directory="templates/public"), name="static")
app.mount("/user_images", StaticFiles(directory="json_file/users"), name="user_images")



@app.get("/", response_class=HTMLResponse)
def home_page(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


#注册登陆页面
# @app.get("/login_page", response_class=HTMLResponse)
# def login_page(request: Request):
#     return templates.TemplateResponse("login.html", {"request": request})
#
# @app.get("/register_page", response_class=HTMLResponse)
# def register_page(request: Request):
#     return templates.TemplateResponse("signup.html", {"request": request})

@app.get("/style", response_class=HTMLResponse)
def style(request: Request):
    return templates.TemplateResponse("style.html", {"request": request})

@app.get("/closet", response_class=HTMLResponse)
def register_page(request: Request):
    return templates.TemplateResponse("closet.html", {"request": request})

@app.get("/intro", response_class=HTMLResponse)
def intro(request: Request):
    return templates.TemplateResponse("intro.html", {"request": request})

@app.get("/add", response_class=HTMLResponse)
def add(request: Request):
    return templates.TemplateResponse("add.html", {"request": request})

@app.get("/closet_choose", response_class=HTMLResponse)
def closet_choose(request: Request):
    return templates.TemplateResponse("closet_choose.html", {"request": request})

if __name__ == "__main__":
    # _get_clothes("8d515ccf-cf80-49a6-8412-ad9f8341819c", "test01")
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)