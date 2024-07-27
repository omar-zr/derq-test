# from datetime import datetime
# from enum import Enum
# from typing import List, Optional, Dict
# import uuid

# from pydantic import BaseModel, EmailStr, conint
# from sqlmodel import Field, Relationship, SQLModel


# # Shared properties
# class UserBase(SQLModel):
#     email: EmailStr = Field(unique=True, index=True, max_length=255)
#     is_active: bool = True
#     is_superuser: bool = False
#     full_name: Optional[str] = Field(default=None, max_length=255)


# # Properties to receive via API on creation
# class UserCreate(UserBase):
#     password: str = Field(min_length=8, max_length=40)


# class UserRegister(SQLModel):
#     email: EmailStr = Field(max_length=255)
#     password: str = Field(min_length=8, max_length=40)
#     full_name: Optional[str] = Field(default=None, max_length=255)


# # Properties to receive via API on update, all are optional
# class UserUpdate(UserBase):
#     email: Optional[EmailStr] = Field(default=None, max_length=255)
#     password: Optional[str] = Field(default=None, min_length=8, max_length=40)


# class UserUpdateMe(SQLModel):
#     full_name: Optional[str] = Field(default=None, max_length=255)
#     email: Optional[EmailStr] = Field(default=None, max_length=255)


# class UpdatePassword(SQLModel):
#     current_password: str = Field(min_length=8, max_length=40)
#     new_password: str = Field(min_length=8, max_length=40)


# # Database model, database table inferred from class name
# class User(UserBase, table=True):
#     id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
#     hashed_password: str


# # Properties to return via API, id is always required
# class UserPublic(UserBase):
#     id: uuid.UUID


# class UsersPublic(SQLModel):
#     data: List[UserPublic]
#     count: int


# # Sensor Table
# class Sensor(SQLModel, table=True):
#     id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
#     name: str = Field(max_length=255)
#     location: str = Field(max_length=255)
#     manufacture_id: Optional[str] = Field(default=None, max_length=255)
#     note: Optional[str] = Field(default=None, max_length=255)


# class SensorPublic(SQLModel):
#     id: uuid.UUID
#     name: str
#     location: str
#     manufacture_id: Optional[str]
#     note: Optional[str]


# class SensorsPublic(SQLModel):
#     data: List[SensorPublic]
#     count: int


# # Sensor Data Table
# class SensorClass(str, Enum):
#     car = "car"
#     motorcycle = "motorcycle"
#     pedestrian = "pedestrian"
#     bicycle = "bicycle"
#     mobility_aid = "mobility_aid"


# class Approach(str, Enum):
#     NB = "NB"  # Northbound
#     SB = "SB"  # Southbound
#     WB = "WB"  # Westbound
#     EB = "EB"  # Eastbound


# class SensorData(SQLModel, table=True):
#     id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
#     sensor_id: uuid.UUID = Field(foreign_key="sensor.id", nullable=False)
#     sensor: Sensor = Relationship()
#     class_type: SensorClass = Field(sa_column_kwargs={"nullable": False})
#     approach: Approach = Field(sa_column_kwargs={"nullable": False})
#     time: datetime = Field()


# class SensorDataPublic(SQLModel):
#     sensor_id: uuid.UUID
#     class_type: SensorClass
#     approach: Approach
#     time: datetime


# class SensorDataPublicList(BaseModel):
#     data: List[SensorDataPublic]
#     count: int


# class ApproachCount(BaseModel):
#     approach: str
#     count: int


# class HourlyData(BaseModel):
#     time: datetime
#     count: int


# class ApproachData(BaseModel):
#     approach: str
#     hours: List[HourlyData]


# class DetailedHourlyCount(BaseModel):
#     hour: datetime
#     totalCount: int
#     approaches: List[ApproachCount]


# class DetailedApproachCount(BaseModel):
#     approach: str
#     count: int
#     class_type: str


# class HourlyApproachCount(BaseModel):
#     hour: datetime
#     totalCount: int
#     results: Dict[str, int]


# class SensorDataCreate(BaseModel):
#     sensor_id: uuid.UUID
#     class_type: str
#     approach: str
#     time: datetime


# # Sensor Health Table
# class SensorHealth(SQLModel, table=True):
#     id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
#     sensor_id: uuid.UUID = Field(foreign_key="sensor.id", nullable=False)
#     sensor: Sensor = Relationship()
#     time: datetime = Field()
#     dcp: int = Field(ge=0, le=100)
#     online: bool
#     fault: bool


# class SensorHealthPublic(SQLModel):
#     id: uuid.UUID
#     sensor_id: uuid.UUID
#     time: datetime
#     dcp: int
#     online: bool
#     fault: bool


# class SensorHealthPublicList(SQLModel):
#     data: List[SensorHealthPublic]
#     count: int


# class GapDetails(BaseModel):
#     startTime: datetime
#     endTime: datetime
#     duration: str


# class SensorHealthCreate(BaseModel):
#     sensor_id: uuid.UUID
#     time: datetime
#     dcp: int
#     online: bool
#     fault: bool


# # Generic message
# class Message(SQLModel):
#     message: str


# # JSON payload containing access token
# class Token(SQLModel):
#     access_token: str
#     token_type: str = "bearer"


# # Contents of JWT token
# class TokenPayload(SQLModel):
#     sub: Optional[str] = None


# class NewPassword(SQLModel):
#     token: str
#     new_password: str = Field(min_length=8, max_length=40)