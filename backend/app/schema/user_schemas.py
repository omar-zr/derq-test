from typing import List

from pydantic import BaseModel

from app.models.user_models import UserPublic
from sqlmodel import SQLModel # type: ignore


class UsersPublic(SQLModel):
    data: List[UserPublic]
    count: int