from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.connections import engine, Base, prepare_database
from app.models import user_model

from app.routes.auth_routes import router
from app.routes.dashboard_routes import router as dashboard_router
from app.routes.shop_routes import router as shop_router

prepare_database()
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="JWT Authentication API"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
app.include_router(dashboard_router)
app.include_router(shop_router)


@app.get("/")
def home():
    return {
        "message": "JWT Auth Running"
    }
