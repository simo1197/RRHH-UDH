# Backend/main.py
import re
from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import mysql.connector
import bcrypt
from jose import jwt, JWTError
from datetime import datetime, timedelta
from mysql.connector import Error as MySQLError
from db_config import db_config

app = FastAPI(title="UDH2024 Backend - Login + Bitacora (lectura)")

# CORS
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
SECRET_KEY = "mi_clave_ultra_secreta_1234567890"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# UTILIDADES
def get_db_conn():
    try:
        return mysql.connector.connect(**db_config)
    except MySQLError as e:
        raise HTTPException(status_code=500, detail=f"DB connection error: {e}")

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

def normalize_col_name(colname: str) -> str:
    return re.sub(r'\W+', '', colname or "").lower()

def get_bitacora_column_map(conn):
    cursor = conn.cursor()
    try:
        cursor.execute(
            "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS "
            "WHERE TABLE_SCHEMA = %s AND TABLE_NAME = %s",
            (db_config["database"], "bitacora")
        )
        rows = cursor.fetchall()
        cols = [r[0] for r in rows]
    except MySQLError as e:
        raise HTTPException(status_code=500, detail=f"DB error reading schema: {e}")
    finally:
        try: cursor.close()
        except: pass

    mapping = {}
    for c in cols:
        nc = normalize_col_name(c)
        if nc == "id" or nc.endswith("id"):
            mapping.setdefault("id", c)
        elif "usuario" in nc or "user" in nc:
            mapping.setdefault("usuario", c)
        elif "accion" in nc or "action" in nc:
            mapping.setdefault("accion", c)
        elif "fecha" in nc or "hora" in nc or "date" in nc or "time" in nc:
            mapping.setdefault("fecha_hora", c)

    if "id" not in mapping and cols:
        mapping.setdefault("id", cols[0])

    return mapping

def normalize_row_dict(row: dict):
    mapped = {"id": None, "usuario": "", "accion": "", "fecha_hora": ""}
    for k, v in row.items():
        nk = normalize_col_name(k)
        if "id" == nk or nk.endswith("id"):
            mapped["id"] = v
        elif "usuario" in nk or "user" in nk:
            mapped["usuario"] = v
        elif "accion" in nk or "action" in nk:
            mapped["accion"] = v
        elif "fecha" in nk or "hora" in nk or "date" in nk or "time" in nk:
            if isinstance(v, datetime):
                mapped["fecha_hora"] = v.strftime("%Y-%m-%d %H:%M:%S")
            else:
                mapped["fecha_hora"] = str(v)
        else:
            if mapped["accion"] == "" and isinstance(v, str) and len(str(v)) > 0:
                mapped["accion"] = v

    if mapped["id"] is None:
        for v in row.values():
            if isinstance(v, int):
                mapped["id"] = v
                break

    return mapped

# LOGIN
@app.post("/login")
def login(data: LoginModel):
    try:
        conn = get_db_conn()
    except HTTPException:
        raise
    cursor = None
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM usuarios WHERE usuario = %s", (data.usuario,))
        user = cursor.fetchone()
        if not user:
            raise HTTPException(status_code=401, detail="Usuario no encontrado")

        pw_field = None
        for key in user.keys():
            if normalize_col_name(key) in ('password','passwd','pwd','pass','contrasena','contraseña'):
                pw_field = key
                break

        if not pw_field:
            raise HTTPException(status_code=500, detail="Usuario no tiene contraseña almacenada")

        hashed_pw = user.get(pw_field)
        if not hashed_pw or str(hashed_pw).strip() == "":
            raise HTTPException(status_code=500, detail="Usuario no tiene contraseña almacenada")

        if not bcrypt.checkpw(data.password.encode('utf-8'), str(hashed_pw).encode('utf-8')):
            raise HTTPException(status_code=401, detail="Contraseña incorrecta")

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
            try: cursor.close()
            except: pass
        if conn:
            try: conn.close()
            except: pass

# WHOAMI
@app.get("/whoami")
def whoami(authorization: str = Header(None)):
    username = extract_username_from_token(authorization)
    return {"usuario": username}

# LISTAR BITACORA
@app.get("/bitacora")
def listar_bitacora(usuario: str = None, page: int = 1, page_size: int = 50, sort: str = "asc"):
    if page < 1:
        page = 1
    if page_size < 1:
        page_size = 50
    sort_dir = "ASC" if str(sort).lower() == "asc" else "DESC"

    conn = get_db_conn()
    cursor = None
    try:
        colmap = get_bitacora_column_map(conn)
        cursor = conn.cursor(dictionary=True)

        order_col = colmap.get("fecha_hora") or colmap.get("id") or list(colmap.values())[0]

        if usuario:
            like = f"%{usuario}%"
            count_sql = f"SELECT COUNT(*) as c FROM bitacora WHERE `{colmap.get('usuario', 'USUARIO')}` LIKE %s"
            cursor.execute(count_sql, (like,))
            total = cursor.fetchone()["c"]
        else:
            count_sql = "SELECT COUNT(*) as c FROM bitacora"
            cursor.execute(count_sql)
            total = cursor.fetchone()["c"]

        offset = (page - 1) * page_size

        if usuario:
            like = f"%{usuario}%"
            sql = f"SELECT * FROM bitacora WHERE `{colmap.get('usuario', 'USUARIO')}` LIKE %s ORDER BY `{order_col}` {sort_dir} LIMIT %s OFFSET %s"
            cursor.execute(sql, (like, page_size, offset))
        else:
            sql = f"SELECT * FROM bitacora ORDER BY `{order_col}` {sort_dir} LIMIT %s OFFSET %s"
            cursor.execute(sql, (page_size, offset))

        rows = cursor.fetchall()
        mapped = [normalize_row_dict(row) for row in rows]
        return {
            "total": total,
            "page": page,
            "page_size": page_size,
            "results": mapped
        }
    except MySQLError as e:
        raise HTTPException(status_code=500, detail=f"DB select error: {e}")
    finally:
        if cursor:
            try: cursor.close()
            except: pass
        if conn:
            try: conn.close()
            except: pass

# ROOT
@app.get("/")
def root():
    return {"message": "Backend UDH2024 funcionando correctamente"}










