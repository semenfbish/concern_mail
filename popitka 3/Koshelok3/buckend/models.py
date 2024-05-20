
from peewee import *
from pydantic import BaseModel, EmailStr, Field, validator

db = DatabaseProxy()

class BaseDBModel(Model):
    id = AutoField(unique=True)
    class Meta:
        database = db


class users(BaseDBModel):
    address = CharField()
    public_key = CharField()
    private_key = CharField()

class messages(BaseDBModel):
    sender_address = CharField()
    recipient_address = CharField()
    encrypted_message = CharField()
    keyg = CharField()


db_models = [users, messages]

import pydantic

class MessageResponse(pydantic.BaseModel):
    id: int
    sender_address: str
    recipient_address: str
    encrypted_message: str
    @staticmethod
    def from_db(message: messages):
        us = MessageResponse(
            id=message.id, 
            sender_address=message.sender_address, 
            recipient_address=message.recipient_address,
            encrypted_message=message.encrypted_message
            )
        return us
class UserResponse(pydantic.BaseModel):
    id: int
    address: str

    @staticmethod
    def from_db(user: users):
        ms = UserResponse(
            id=user.id, 
            address=user.address, 
            )
        return ms

class RegisterUser(pydantic.BaseModel):
    address: str
    public_key: str
    private_key: str
class RegisterMessage(pydantic.BaseModel):
    sender_address: str
    recipient_address: str
    encrypted_message: str
    keyg: str
class CheckUser(pydantic.BaseModel):
    address: str
        
    
