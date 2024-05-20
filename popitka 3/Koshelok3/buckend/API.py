from typing import List
from fastapi import Depends, FastAPI
from sqlalchemy import create_engine
import hashlib
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from config import DB_PORT, DB_HOST, DB_NAME
import uvicorn
import datetime
from fastapi.encoders import jsonable_encoder
import time
from config import *
from models import *
import jwt
import logging
import asyncio
from datetime import datetime, timedelta
from tonsdk.utils import Address
from nacl.utils import random
import jwt
from pytonconnect import TonConnect
from pytonconnect.parsers import WalletInfo
from fastapi import FastAPI, Request, Response
from fastapi.exceptions import HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.hkdf import HKDF
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives.asymmetric import padding  
import os
import base64

app = FastAPI(
    version="1.0.0",
    title="WeatherForecast API",
    description="API for WeatherForecast",
    docs_url="/docs",
    redoc_url="/redoc",
    root_path="/buckend"
)

logger = logging.getLogger('uvicorn.error')

@app.on_event("startup")
async def startup():
    # Connect to the database
    db_init = None
    try:
        if (DB_TYPE == "sqlite"):
            db_init = SqliteDatabase(DB_NAME)
    except Exception as e:
        logger.error(f"Error: {e}")
    logger.info(f"Connected to the database by {type(db)}")
    # time.sleep(5)
    db.initialize(db_init)
    db.connect()
    db.create_tables(db_models)

def create_jwt(data: dict):
    return jwt.encode({"data": jsonable_encoder(data), "exp": (datetime.datetime.now() + datetime.timedelta(hours=8)).timestamp()}, JWT_KEY, algorithm="HS256")

def decode_jwt(s: str):
    return jwt.decode(s, JWT_KEY, algorithms=["HS256"])

def check_jwt_token(s: str):
    """Check JWT token. If valid then return user data, else return None"""
    try:
        token = decode_jwt(s)
        exp = token.get("exp")
        if exp is None or exp < time.time():
            return None
        return token.get("data")
    except:
        return None

def get_hash(password: str):
    return hashlib.sha256(password.encode()).hexdigest()


@app.post("/send_message", tags=['sendm'], response_model=MessageResponse, 
          responses={
              200: {}, 
              201: {"description": "message created", "model": MessageResponse}, 
              400: {"description": "Bad request"}, 
              403: {"description": "Forbidden"}, 
              409: {"description": "Conflict"}
            })
async def send_message(model: RegisterMessage):
    try:
        user = messages.create(sender_address=model.sender_address, recipient_address=model.recipient_address, encrypted_message=model.encrypted_message, keyg=model.keyg)
        print(user)
        return JSONResponse(jsonable_encoder(MessageResponse.from_db(user)), status_code=201)
    except Exception as e:
        
        # В случае ошибки возвращаем HTTP 500
        raise HTTPException(status_code=500, detail=str(e))
@app.post("/create_user", tags=['creu'], response_model=UserResponse, 
          responses={
              200: {}, 
              201: {"description": "user created", "model": MessageResponse}, 
              400: {"description": "Bad request"}, 
              403: {"description": "Forbidden"}, 
              409: {"description": "Conflict"}
            })
async def create_user(model: CheckUser):
    try:
        user = users.get_or_none(users.address == model.address)
        if not user:
            # Generate AES-128 keys
            aes_key = os.urandom(16)
            iv = os.urandom(16)

            # Encrypt AES-128 key with RSA
            private_key = rsa.generate_private_key(
                public_exponent=65537,
                key_size=2048
            )
            public_key = private_key.public_key()
            encrypted_aes_key = public_key.encrypt(
                aes_key,
                padding.OAEP(
                    mgf=padding.MGF1(algorithm=hashes.SHA256()),
                    algorithm=hashes.SHA256(),
                    label=None
                )
            )
            # Encode keys as base64
            encrypted_aes_key_b64 = base64.b64encode(encrypted_aes_key).decode('utf-8')
            iv_b64 = base64.b64encode(iv).decode('utf-8')
            print("asdasdas  " + encrypted_aes_key_b64)
            print("dsadsads  " + iv_b64)
            # Create user with encrypted AES-128 key and initialization vector
            user = users.create(address=model.address, public_key=encrypted_aes_key_b64, private_key=iv_b64)
            return JSONResponse(jsonable_encoder(UserResponse.from_db(user)), status_code=201)
        else:
            return JSONResponse(content={"message": "Это свой!"}, status_code=228)
    except Exception as e:
        logging.error(f"An error occurred: {str(e)}")
        # В случае ошибки возвращаем HTTP 500
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/get_messages", tags=['getm'], response_model=List[MessageResponse],
          responses={
              200: {"description": "User found"},
              400: {"description": "Bad request"},
              403: {"description": "Forbidden"},
              404: {"description": "User not found"},
              409: {"description": "Conflict"}
            })
async def get_messages(address: str):
    try:
        filtered_messages = (messages
                             .select()
                             .where((messages.sender_address == address) | (messages.recipient_address == address)))
        if not filtered_messages:
            raise HTTPException(status_code=404, detail="Пользователь еще не общался!")
        
        message_responses = []
        for message in filtered_messages:
            message_responses.append(MessageResponse(id=message.id, 
                                                      sender_address=message.sender_address, 
                                                      recipient_address=message.recipient_address,
                                                      encrypted_message=message.encrypted_message))
        return message_responses
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
def generate_payload(ttl: int) -> str:
    payload = bytearray(random(8))

    ts = int(datetime.now().timestamp()) + ttl
    payload.extend(ts.to_bytes(8, 'big'))

    return payload.hex()

non_auth_endpoints = ["/", "/send_message","/create_user"]
origins = [
    "http://localhost",
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.middleware("http")
async def auth_middleware(request: Request, call_next):
    resp = await  call_next(request)
    return resp





def check_payload(payload: str, wallet_info: WalletInfo):
    if len(payload) < 32:
        print('Payload length error')
        return False
    if not wallet_info.check_proof(payload):
        print('Check proof failed')
        return False
    ts = int(payload[16:32], 16)
    if datetime.now().timestamp() > ts:
        print('Request timeout error')
        return False
    return True
async def main():
    proof_payload = generate_payload(600)

    connector = TonConnect(manifest_url='http://raw.githubusercontent.com/semenfbish/Ton-xren/main/test/manifest.json')

    def status_changed(wallet_info):
        print('wallet_info:', wallet_info)
        if wallet_info is not None:
            print('check_proof:', check_payload(proof_payload, wallet_info))

        unsubscribe()

    def status_error(e):
        print('connect_error:', e)

    unsubscribe = connector.on_status_change(status_changed, status_error)

    wallets_list = connector.get_wallets()
    print('wallets_list:', wallets_list)

    generated_url = await connector.connect(wallets_list[0], {
        'ton_proof': proof_payload
    })
    print('generated_url:', generated_url)

    print('Waiting 2 minutes to connect...')
    for i in range(120):
        await asyncio.sleep(1)
        if connector.connected:
            if connector.account.address:
                print('Connected with address:', Address(connector.account.address).to_string(True, True, True))
            break

    if connector.connected:
        # Генерация JWT токена
        token_payload = {
            "address": connector.account.address,
            "proof_payload": proof_payload,
            "exp": datetime.utcnow() + timedelta(minutes=60)  # Срок действия токена 60 минут
        }
        jwt_token = jwt.encode(token_payload, 'bulatgay', algorithm='HS256')
        print('JWT token:', jwt_token)

        print('Waiting 2 minutes to disconnect...')
        asyncio.create_task(connector.disconnect())
        for i in range(120):
            await asyncio.sleep(1)
            if not connector.connected:
                print('Disconnected')
                break

    print('App is closed')


if __name__ == '__main__':
    if (APP_DEBUG):
        #asyncio.get_event_loop().run_until_complete(main())
        uvicorn.run("API:app", host=APP_HOST, port=APP_PORT, reload=True, workers=1, root_path=ROOT_PATH)
    else:
        uvicorn.run("API:app", host=APP_HOST, port=APP_PORT, workers=3, root_path=ROOT_PATH)    
