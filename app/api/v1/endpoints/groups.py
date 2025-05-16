from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.init_db import get_db
from app.models.group import Group
from app.schemas.group import GroupCreate, Group as GroupSchema

router = APIRouter()

@router.post("/", response_model=GroupSchema)
def create_group(group: GroupCreate, db: Session = Depends(get_db)):
    db_group = Group(
        name=group.name,
        description=group.description
    )
    db.add(db_group)
    db.commit()
    db.refresh(db_group)
    return db_group

@router.get("/", response_model=List[GroupSchema])
def read_groups(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    groups = db.query(Group).offset(skip).limit(limit).all()
    return groups

@router.get("/{group_id}", response_model=GroupSchema)
def read_group(group_id: int, db: Session = Depends(get_db)):
    db_group = db.query(Group).filter(Group.id == group_id).first()
    if db_group is None:
        raise HTTPException(status_code=404, detail="Group not found")
    return db_group
