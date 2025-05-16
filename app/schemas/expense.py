from pydantic import BaseModel
from typing import List

class ExpenseSplitCreate(BaseModel):
    user_id: int
    amount: float

class ExpenseCreate(BaseModel):
    description: str
    amount: float
    payer_id: int
    group_id: int
    splits: List[ExpenseSplitCreate]

class Expense(BaseModel):
    id: int
    description: str
    amount: float
    payer_id: int
    group_id: int
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True
