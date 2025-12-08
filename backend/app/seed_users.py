from app.db.sessions import SessionLocal
from app.db.models import User
from app.security import get_password_hash


def seed():
    db = SessionLocal()
    try:
        if not db.query(User).filter(User.email == "admin_volcana@eafit.edu.co").first():
            admin = User(
                email="admin_volcana@eafit.edu.co",
                full_name="Admin Volcana",
                password_hash=get_password_hash("volcana"),
                role="admin",
                is_active=True,
            )
            db.add(admin)

        if not db.query(User).filter(User.email == "editor_volcana@eafit.edu.co").first():
            editor = User(
                email="editor_volcana@eafit.edu.co",
                full_name="Editor Volcana",
                password_hash=get_password_hash("volcana"),
                role="editor",
                is_active=True,
            )
            db.add(editor)

        db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    seed()
