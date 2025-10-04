from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import mysql.connector
import bcrypt
from jose import JWTError, jwt
from datetime import datetime, timedelta

app = FastAPI(title="UDH2024 Backend - Login")

# -------------------------------
# CONFIGURACIÓN CORS
# -------------------------------
origins = [
    "http://localhost:3000",  # URL de tu frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------
# CONFIGURACIÓN DE LA BASE DE DATOS
# -------------------------------
db_config = {
    "host": "localhost",
    "user": "root",           
    "password": "@RRHH2024GDZ",
    "database": "UDH2024"
}

# -------------------------------
# MODELO DE DATOS PARA LOGIN
# -------------------------------
class LoginModel(BaseModel):
    usuario: str
    password: str

# -------------------------------
# CONFIGURACIÓN JWT
# -------------------------------
SECRET_KEY = "mi_clave_ultra_secreta_1234567890"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# -------------------------------
# ENDPOINT /login
# -------------------------------
@app.post("/login")
def login(data: LoginModel):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        
        cursor.execute("SELECT * FROM usuarios WHERE USUARIO = %s", (data.usuario,))
        user = cursor.fetchone()
        
        if not user:
            raise HTTPException(status_code=401, detail="Usuario no encontrado")
        
        if not bcrypt.checkpw(data.password.encode('utf-8'), user['PASSWORD'].encode('utf-8')):
            raise HTTPException(status_code=401, detail="Contraseña incorrecta")
        
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        token_data = {"sub": user['USUARIO'], "rol": user['ROL'], "exp": expire}
        token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)
        
        return {"access_token": token, "token_type": "bearer"}
    
    finally:
        cursor.close()
        conn.close()

# -------------------------------
# ENDPOINT DE PRUEBA
# -------------------------------
@app.get("/")
def root():
    return {"message": "Backend UDH2024 funcionando correctamente"}

