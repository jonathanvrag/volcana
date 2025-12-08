"""add users table

Revision ID: 38eb91b03c49
Revises: 
Create Date: 2025-12-08 15:53:59.923544

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = '38eb91b03c49'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("email", sa.String(255), unique=True,
                  index=True, nullable=False),
        sa.Column("full_name", sa.String(255), nullable=True),
        sa.Column("password_hash", sa.String(255), nullable=False),
        sa.Column("role", sa.String(50), nullable=False,
                  server_default="editor"),
        sa.Column("is_active", sa.Boolean, nullable=False,
                  server_default=sa.text("true")),
    )


def downgrade() -> None:
    op.drop_table("users")
