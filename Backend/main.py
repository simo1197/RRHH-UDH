# Backend/main.py
"""
Backend UDH2024 - Auth minimal compatible con el esquema udh2024.
Endpoints:
 - POST /login  -> recibe { usuario, password } y devuelve JWT (sub=usuario, user_id, roles)
 - GET  /whoami -> header Authorization: Bearer <token> devuelve sub (usuario)

Comportamiento:
 - Si hay problema de conexión a la BD devuelve 503 con detalle en español.
 - Si usuario no existe => 401 "Usuario no encontrado".
 - Si contraseña incorrecta => 401 "Contraseña incorrecta".
"""

from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import mysql.connector
import bcrypt
from jose import jwt, JWTError
from datetime import datetime, timedelta
from mysql.connector import Error as MySQLError
import logging

# Import relativo al paquete Backend
from .db_config import db_config

# Logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("udh2024")

app = FastAPI(title="UDH2024 Backend - Auth adapted")

# CORS (para pruebas permite solo frontend)
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

# MODELOS
class LoginModel(BaseModel):
    usuario: str
    password: str

# JWT
SECRET_KEY = "mi_clave_ultra_secreta_1234567890"  # en prod usar ENV
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# UTILIDADES DB
def get_db_conn():
    """
    Con timeout corto para evitar que la petición se quede colgada si MySQL no responde.
    Si falla lanza HTTPException con status 503.
    """
    try:
        # connection_timeout evita bloqueos largos
        conn = mysql.connector.connect(**db_config, connection_timeout=5)
        return conn
    except MySQLError as e:
        logger.exception("Fallo al conectar a la base de datos")
        # Mensaje amigable en español para que el frontend lo muestre
        raise HTTPException(status_code=503, detail=f"No hay conexión con el servidor de base de datos: {e}")

def _bytes_from_col(val):
    """Normaliza el valor retornado de la columna 'clave' a bytes si es posible."""
    if val is None:
        return None
    if isinstance(val, (bytes, bytearray)):
        return bytes(val)
    if isinstance(val, memoryview):
        return val.tobytes()
    if isinstance(val, str):
        return val.encode('utf-8')
    # fallback: str
    return str(val).encode('utf-8')

# Obtener nombre de rol (nuestro esquema guarda id_rol en usuario)
def get_role_name(conn, id_rol):
    cur = conn.cursor()
    try:
        cur.execute("SELECT nombre FROM rol WHERE id = %s", (id_rol,))
        r = cur.fetchone()
        return r[0] if r else None
    finally:
        try: cur.close()
        except: pass

# LOGIN
@app.post("/login")
def login(data: LoginModel):
    conn = None
    cur = None
    try:
        # intento conectar (si falla, get_db_conn lanza HTTPException 503)
        conn = get_db_conn()
        cur = conn.cursor(dictionary=True)
        cur.execute("SELECT id, usuario, clave, id_rol, is_active FROM usuario WHERE usuario = %s", (data.usuario,))
        user = cur.fetchone()

        if not user:
            # 401 para credenciales inválidas — mensaje claro
            raise HTTPException(status_code=401, detail="Usuario no existe")

        if user.get("is_active") is not None and int(user.get("is_active")) == 0:
            raise HTTPException(status_code=403, detail="Usuario inactivo")

        raw_clave = user.get("clave")
        hashed_bytes = _bytes_from_col(raw_clave)

        if not hashed_bytes or (isinstance(hashed_bytes, (bytes, bytearray)) and len(hashed_bytes) == 0):
            raise HTTPException(status_code=500, detail="Usuario no tiene contraseña almacenada")

        password_ok = False
        try:
            # heurístico: si comienza con $2 -> bcrypt hash
            if hashed_bytes.startswith(b"$2"):
                password_ok = bcrypt.checkpw(data.password.encode('utf-8'), hashed_bytes)
            else:
                # texto plano almacenado (solo para pruebas) -> comparar directamente
                password_ok = (data.password == hashed_bytes.decode('utf-8'))
        except Exception as ex:
            logger.exception("Error verificando contraseña")
            password_ok = False

        if not password_ok:
            raise HTTPException(status_code=401, detail="Contraseña incorrecta")

        # autenticación exitosa -> obtenemos rol
        roles = []
        try:
            role_name = None
            if user.get("id_rol"):
                role_name = get_role_name(conn, user.get("id_rol"))
            if role_name:
                roles = [role_name]
        except Exception:
            roles = []

        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        token_data = {
            "sub": user.get("usuario"),
            "user_id": user.get("id"),
            "roles": roles,
            "exp": int(expire.timestamp())
        }
        token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)
        return {"access_token": token, "token_type": "bearer"}

    except HTTPException:
        # Re-lanzar HTTPException tal cual (401, 503, etc.)
        raise
    except MySQLError as e:
        # si ocurre un error DB más abajo, devolver 503
        logger.exception("MySQL error en login")
        raise HTTPException(status_code=503, detail=f"No hay conexión con el servidor de base de datos: {e}")
    except Exception as e:
        # Error inesperado
        logger.exception("Error inesperado en /login")
        raise HTTPException(status_code=500, detail="Error interno del servidor")
    finally:
        if cur:
            try: cur.close()
            except: pass
        if conn:
            try: conn.close()
            except: pass

# WHOAMI
def extract_username_from_token(authorization: str):
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(status_code=401, detail="Authorization header mal formado")
    token = parts[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if not username:
            raise HTTPException(status_code=401, detail="Token inválido: sub no presente")
        return username
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")

@app.get("/whoami")
def whoami(authorization: str = Header(None)):
    username = extract_username_from_token(authorization)
    return {"usuario": username}

# Ruta raíz
@app.get("/")
def root():
    return {"message": "UDH2024 backend - auth listo"}













