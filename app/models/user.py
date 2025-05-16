from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    expenses = relationship("Expense", foreign_keys="Expense.payer_id", back_populates="payer")
    groups = relationship("Group", secondary="user_groups", back_populates="users")

    def __repr__(self):
        return f"User(id={self.id}, email={self.email}, full_name={self.full_name})"

    class Config:
        from_attributes = True
