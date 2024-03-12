
from fastapi import FastAPI,UploadFile,Form,Response

from fastapi.responses import JSONResponse

from fastapi.encoders import jsonable_encoder

from fastapi.staticfiles import StaticFiles

from pydantic import BaseModel

from typing import Annotated

import sqlite3

con = sqlite3.connect('db.db', check_same_thread=False)
cur = con.cursor()


app = FastAPI()

class chat(BaseModel):
    id: str
    content: str

chats = []

@app.get('/images/{item_id}')
async def get_image(item_id):
    cur = con.cursor()
    image_bytes = cur.execute(f"""
                              SELECT image from items WHERE id={item_id}
                              """).fetchone()[0]
    
    return Response(content=bytes.fromhex(image_bytes))

@app.post('/items')
async def create_item(image:UploadFile, 
                title:Annotated[str,Form()], 
                price:Annotated[int,Form()], 
                description:Annotated[str,Form()], 
                place:Annotated[str,Form()],
                insertAt:Annotated[int,Form()]):
    
    image_bytes = await image.read()
    cur.execute(f"""
                INSERT INTO items(title, image, price, description, place, insertAt)
                VALUES ('{title}','{image_bytes.hex()}',{price},'{description}','{place}','{insertAt}')
                """)
    con.commit()
    return '200'



@app.get('/items')
async def get_items():
    # 컬럼명도 같이 가져옴
    con.row_factory = sqlite3.Row
    cur = con.cursor()
    rows = cur.execute(f"""
                      SELECT * from items;
                      """).fetchall()
    return JSONResponse(
        jsonable_encoder(
        dict(row) for row in rows
        )
        )

@app.post('/chats')
def create_chat(chat:chat):
    chats.append(chat)
    return '채팅추가 성공'

@app.get('/chats')
def read_chat():
    return chats

@app.put("/chats/{chat_id}")
def put_chat(req_chat:chat):
    for chat in chats:
        if chat.id == req_chat.id:
            chat.content = req_chat.content
            return '성공했습니다.'
    return '실패'

@app.delete("/chats/{chat_id}")
def delete_chat(chat_id):
    for index, chat in enumerate(chats):
        if chat.id == chat_id:
            chats.pop(index)
            return '성공했습니다.'
    return '실패'

app.mount("/", StaticFiles(directory="static",html=True), name="static")