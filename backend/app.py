from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import students, cohort, schools

app = FastAPI(title="RetainIQ API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5500", "http://127.0.0.1:5500"],
    allow_methods=["GET"],
    allow_headers=["*"],
)

app.include_router(students.router)
app.include_router(cohort.router)
app.include_router(schools.router)
