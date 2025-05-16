from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.init_db import get_db
from app.models.expense import Expense
from app.models.expense_split import ExpenseSplit
from app.schemas.expense import ExpenseCreate, Expense as ExpenseSchema

router = APIRouter()

@router.post("/", response_model=ExpenseSchema)
def create_expense(expense: ExpenseCreate, db: Session = Depends(get_db)):
    # Create the expense
    db_expense = Expense(
        description=expense.description,
        amount=expense.amount,
        payer_id=expense.payer_id,
        group_id=expense.group_id
    )
    db.add(db_expense)
    db.flush()  # Get the expense ID before creating splits
    
    # Create expense splits
    for split in expense.splits:
        db_split = ExpenseSplit(
            expense_id=db_expense.id,
            user_id=split.user_id,
            amount=split.amount
        )
        db.add(db_split)
    
    db.commit()
    db.refresh(db_expense)
    return db_expense

@router.get("/", response_model=List[ExpenseSchema])
def read_expenses(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    expenses = db.query(Expense).offset(skip).limit(limit).all()
    return expenses

@router.get("/{expense_id}", response_model=ExpenseSchema)
def read_expense(expense_id: int, db: Session = Depends(get_db)):
    db_expense = db.query(Expense).filter(Expense.id == expense_id).first()
    if db_expense is None:
        raise HTTPException(status_code=404, detail="Expense not found")
    return db_expense
