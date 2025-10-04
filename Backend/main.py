from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import mysql.connector
import bcrypt
from jose import JWTError, jwt
from datetime import datetime, timedelta

app = FastAPI(title="UDH2024 Backend - Login")

# -------------------------------
# CONFIGURACIÓN DE LA BASE DE DATOS
# -------------------------------
db_config = {
    "host": "localhost",
    "user": "root",           # Cambia aquí tu usuario de MySQL
    "password": "@Aubameyang123",# Cambia aquí tu contraseña de MySQL
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
SECRET_KEY = "mi_clave_ultra_secreta_1234567890"   # Cambia por una cadena larga y secreta
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# -------------------------------
# ENDPOINT /login
# -------------------------------
@app.post("/login")
def login(data: LoginModel):
    try:
        # Conectar a la base de datos
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        
        # Buscar usuario en la DB
        cursor.execute("SELECT * FROM usuarios WHERE USUARIO = %s", (data.usuario,))
        user = cursor.fetchone()
        
        if not user:
            raise HTTPException(status_code=401, detail="Usuario no encontrado")
        
        # Verificar contraseña con bcrypt
        if not bcrypt.checkpw(data.password.encode('utf-8'), user['PASSWORD'].encode('utf-8')):
            raise HTTPException(status_code=401, detail="Contraseña incorrecta")
        
        # Crear token JWT
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
