# Backend/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import mysql.connector
import bcrypt
from jose import jwt
from datetime import datetime, timedelta
from mysql.connector import Error as MySQLError
from db_config import db_config

app = FastAPI(title="UDH2024 Backend - Login")

# -------------------------------
# CORS
# -------------------------------
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------
# MODELO
# -------------------------------
class LoginModel(BaseModel):
    usuario: str
    password: str

# -------------------------------
# JWT
# -------------------------------
SECRET_KEY = "mi_clave_ultra_secreta_1234567890"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# -------------------------------
# ENDPOINT /login
# -------------------------------
@app.post("/login")
def login(data: LoginModel):
    # Intentar conectar a la DB
    try:
        conn = mysql.connector.connect(**db_config)
    except MySQLError as e:
        # Error de conexión a la DB -> 500
        raise HTTPException(status_code=500, detail=f"DB connection error: {e}")

    cursor = None
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM usuarios WHERE usuario = %s", (data.usuario,))
        user = cursor.fetchone()

        if not user:
            raise HTTPException(status_code=401, detail="Usuario no encontrado")

        # ---------------------------------------------------------
        # Buscar campo de contraseña de forma case-insensitive y
        # con nombres comunes (soporta PASSWORD, password, PASS, contrasena, etc.)
        # ---------------------------------------------------------
        pw_field = None
        for key in user.keys():
            if key.lower() in ('password', 'passwd', 'pwd', 'pass', 'contrasena', 'contraseña'):
                pw_field = key
                break

        if not pw_field:
            # No se encontró campo conocido de contraseña
            raise HTTPException(status_code=500, detail="Usuario no tiene contraseña almacenada")

        hashed_pw = user.get(pw_field)
        if not hashed_pw or str(hashed_pw).strip() == "":
            raise HTTPException(status_code=500, detail="Usuario no tiene contraseña almacenada")

        # Verificar contraseña (bcrypt)
        try:
            if not bcrypt.checkpw(data.password.encode('utf-8'), str(hashed_pw).encode('utf-8')):
                raise HTTPException(status_code=401, detail="Contraseña incorrecta")
        except ValueError:
            # Error al interpretar el hash
            raise HTTPException(status_code=500, detail="Hash de contraseña inválido")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error verificando contraseña: {e}")

        # Generar token
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        token_data = {
            "sub": user.get('usuario'),
            "rol": user.get('rol', ''),
            "exp": int(expire.timestamp())
        }
        token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)

        return {"access_token": token, "token_type": "bearer"}

    finally:
        if cursor:
            try:
                cursor.close()
            except:
                pass
        if conn:
            try:
                conn.close()
            except:
                pass

# -------------------------------
# ENDPOINT RAÍZ PARA COMPROBAR
# -------------------------------
@app.get("/")
def root():
    return {"message": "Backend UDH2024 funcionando correctamente"}




