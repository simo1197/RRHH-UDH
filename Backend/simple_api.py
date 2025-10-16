# Backend/simple_api.py
# API mínima y autocontenida: maestros + crear personal + upload hoja_vida + crear usuario + login
# Arranque: uvicorn Backend.simple_api:app --reload --port 8000

import os
import shutil
from typing import Optional, Dict
from fastapi import FastAPI, APIRouter, HTTPException, Query, UploadFile, File, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import mysql.connector
import bcrypt

# ---------- CONFIG ----------
DB_HOST = os.getenv("DATABASE_HOST", "127.0.0.1")
DB_USER = os.getenv("DATABASE_USER", "root")
DB_PASSWORD = os.getenv("DATABASE_PASSWORD", "@UDH2024GDZ")
DB_NAME = os.getenv("DATABASE_NAME", "udh2024")
DB_PORT = int(os.getenv("DATABASE_PORT", "3306"))

API_PREFIX = "/api"
UPLOAD_DIR = os.getenv("HOJA_DIR", "./uploads/hojas")
os.makedirs(UPLOAD_DIR, exist_ok=True)

def get_conn():
    return mysql.connector.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME,
        port=DB_PORT,
        charset="utf8mb4"
    )

def rows_to_list(cursor):
    cols = [c[0] for c in cursor.description] if cursor.description else []
    return [dict(zip(cols, r)) for r in cursor.fetchall()]

# ---------- FastAPI app ----------
app = FastAPI(title="UDH2024 - Simple API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

router = APIRouter(prefix=API_PREFIX)

# ---------- Endpoints maestros (GET) ----------
@router.get("/fuerzas")
def get_fuerzas():
    try:
        conn = get_conn(); cur = conn.cursor()
        cur.execute("SELECT id, nombre FROM fuerza ORDER BY id")
        data = rows_to_list(cur)
        cur.close(); conn.close()
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/rangos")
def get_rangos():
    try:
        conn = get_conn(); cur = conn.cursor()
        cur.execute("SELECT id, nombre FROM rango ORDER BY id")
        data = rows_to_list(cur)
        cur.close(); conn.close()
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/grados")
def get_grados(fuerzaId: Optional[int] = Query(None), rangoId: Optional[int] = Query(None)):
    try:
        conn = get_conn(); cur = conn.cursor()
        sql = "SELECT id, id_fuerza, id_rango, nombre, orden FROM grado"
        filters, params = [], []
        if fuerzaId is not None:
            filters.append("id_fuerza = %s"); params.append(fuerzaId)
        if rangoId is not None:
            filters.append("id_rango = %s"); params.append(rangoId)
        if filters:
            sql += " WHERE " + " AND ".join(filters)
        sql += " ORDER BY orden, nombre"
        cur.execute(sql, params)
        data = rows_to_list(cur)
        cur.close(); conn.close()
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/categorias")
def get_categorias():
    try:
        conn = get_conn(); cur = conn.cursor()
        cur.execute("SELECT id, nombre FROM categoria ORDER BY id")
        data = rows_to_list(cur)
        cur.close(); conn.close()
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/armas")
def get_armas(fuerzaId: Optional[int] = Query(None), categoriaId: Optional[int] = Query(None)):
    try:
        conn = get_conn(); cur = conn.cursor()
        sql = "SELECT id, id_fuerza, id_categoria, nombre FROM arma"
        filters, params = [], []
        if fuerzaId is not None:
            filters.append("id_fuerza = %s"); params.append(fuerzaId)
        if categoriaId is not None:
            filters.append("id_categoria = %s"); params.append(categoriaId)
        if filters:
            sql += " WHERE " + " AND ".join(filters)
        sql += " ORDER BY nombre"
        cur.execute(sql, params)
        data = rows_to_list(cur)
        cur.close(); conn.close()
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/areas")
def get_areas():
    try:
        conn = get_conn(); cur = conn.cursor()
        cur.execute("SELECT id, nombre FROM area ORDER BY nombre")
        data = rows_to_list(cur)
        cur.close(); conn.close()
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/direcciones")
def get_direcciones(areaId: Optional[int] = Query(None)):
    try:
        conn = get_conn(); cur = conn.cursor()
        if areaId is not None:
            cur.execute("SELECT id, id_area, nombre FROM direccion WHERE id_area = %s ORDER BY nombre", (areaId,))
        else:
            cur.execute("SELECT id, id_area, nombre FROM direccion ORDER BY nombre")
        data = rows_to_list(cur)
        cur.close(); conn.close()
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/cargos")
def get_cargos(areaId: Optional[int] = Query(None), direccionId: Optional[int] = Query(None)):
    try:
        conn = get_conn(); cur = conn.cursor()
        sql = "SELECT id, id_area, id_direccion, nombre FROM cargo"
        filters, params = [], []
        if areaId is not None:
            filters.append("id_area = %s"); params.append(areaId)
        if direccionId is not None:
            filters.append("id_direccion = %s"); params.append(direccionId)
        if filters:
            sql += " WHERE " + " AND ".join(filters)
        sql += " ORDER BY nombre"
        cur.execute(sql, params)
        data = rows_to_list(cur)
        cur.close(); conn.close()
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/roles")
def get_roles():
    try:
        conn = get_conn(); cur = conn.cursor()
        cur.execute("SELECT id, nombre FROM rol ORDER BY id")
        data = rows_to_list(cur)
        cur.close(); conn.close()
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ---------- Modelos y endpoints de escritura ----------
class PersonalCreate(BaseModel):
    primer_nombre: str
    segundo_nombre: Optional[str] = None
    primer_apellido: str
    segundo_apellido: Optional[str] = None
    dni: str
    rtn: Optional[str] = None
    cuenta_bancaria: Optional[str] = None
    telefono: Optional[str] = None
    email: Optional[str] = None
    tipo_sangre: Optional[str] = None
    serie: Optional[str] = None
    id_fuerza: Optional[int] = None
    id_rango: Optional[int] = None
    id_grado: Optional[int] = None
    id_categoria: Optional[int] = None
    id_arma: Optional[int] = None
    id_area: Optional[int] = None
    id_direccion: Optional[int] = None
    id_cargo: Optional[int] = None
    fecha_nacimiento: Optional[str] = None
    fecha_ingreso: Optional[str] = None
    estado: Optional[int] = 1

@router.post("/personal")
def create_personal(payload: PersonalCreate):
    try:
        conn = get_conn(); cur = conn.cursor()
        sql = """
           INSERT INTO personal (
             primer_nombre, segundo_nombre, primer_apellido, segundo_apellido,
             dni, rtn, cuenta_bancaria, telefono, email, tipo_sangre, serie,
             id_fuerza, id_rango, id_grado, id_categoria, id_arma,
             id_area, id_direccion, id_cargo, fecha_nacimiento, fecha_ingreso, estado
           ) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
        """
        values = (
            payload.primer_nombre, payload.segundo_nombre, payload.primer_apellido, payload.segundo_apellido,
            payload.dni, payload.rtn, payload.cuenta_bancaria, payload.telefono, payload.email,
            payload.tipo_sangre, payload.serie, payload.id_fuerza, payload.id_rango, payload.id_grado,
            payload.id_categoria, payload.id_arma, payload.id_area, payload.id_direccion, payload.id_cargo,
            payload.fecha_nacimiento, payload.fecha_ingreso, payload.estado
        )
        # Aseguro que la tupla tenga exactamente 22 elementos (si falta alguno, lo ajusto a None)
        if len(values) != 22:
            # relleno con None hasta 22
            values = tuple(list(values) + [None] * (22 - len(values)))
        cur.execute(sql, values)
        conn.commit()
        new_id = cur.lastrowid
        cur.close(); conn.close()
        return {"id": new_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Upload hoja_vida (multipart)
@router.post("/personal/{personal_id}/upload")
async def upload_hoja(personal_id: int, hoja_vida: UploadFile = File(...)):
    try:
        filename = f"{personal_id}_{hoja_vida.filename}"
        dest = os.path.join(UPLOAD_DIR, filename)
        with open(dest, "wb") as buffer:
            shutil.copyfileobj(hoja_vida.file, buffer)
        # Intento actualizar la columna hoja_vida si existe (no obligatorio)
        try:
            conn = get_conn(); cur = conn.cursor()
            cur.execute("UPDATE personal SET hoja_vida=%s WHERE id=%s", (dest, personal_id))
            conn.commit(); cur.close(); conn.close()
        except Exception:
            pass
        return {"ok": True, "path": dest}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class UsuarioCreate(BaseModel):
    usuario: str
    clave: str
    id_rol: int
    id_personal: Optional[int] = None

@router.post("/usuario")
def create_usuario(payload: UsuarioCreate):
    try:
        hashed = bcrypt.hashpw(payload.clave.encode(), bcrypt.gensalt()).decode()
        conn = get_conn(); cur = conn.cursor()
        cur.execute("INSERT INTO usuario (usuario, clave, id_rol, id_personal) VALUES (%s,%s,%s,%s)",
                    (payload.usuario, hashed, payload.id_rol, payload.id_personal))
        conn.commit()
        uid = cur.lastrowid
        cur.close(); conn.close()
        return {"id": uid}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# >>> Inicio: endpoint de login <<<
@router.post("/login")
def login(payload: Dict = Body(...)):
    """
    POST /api/login
    Body esperado: { "usuario": "...", "clave": "..." }
    Respuestas:
      200 -> { id, usuario, id_rol, id_personal }
      401 -> credenciales inválidas
      404 -> usuario no encontrado
    """
    try:
        usuario = payload.get("usuario")
        clave = payload.get("clave")
        if not usuario or not clave:
            raise HTTPException(status_code=400, detail="usuario y clave requeridos")

        conn = get_conn()
        cur = conn.cursor()
        cur.execute("SELECT id, usuario, clave, id_rol, id_personal FROM usuario WHERE usuario = %s LIMIT 1", (usuario,))
        row = cur.fetchone()
        cur.close()
        conn.close()

        if not row:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")

        db_id, db_usuario, db_hashed, db_id_rol, db_id_personal = row

        # manejar hash en bytes/str y comparar con bcrypt
        ok = False
        try:
            if isinstance(db_hashed, bytes):
                ok = bcrypt.checkpw(clave.encode(), db_hashed)
            else:
                ok = bcrypt.checkpw(clave.encode(), db_hashed.encode())
        except Exception:
            # fallback: comparación directa (temporal, no recomendable en prod)
            ok = (clave == db_hashed)

        if not ok:
            raise HTTPException(status_code=401, detail="Credenciales inválidas")

        return {
            "id": db_id,
            "usuario": db_usuario,
            "id_rol": db_id_rol,
            "id_personal": db_id_personal
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
# >>> Fin: endpoint de login <<<

# include router
app.include_router(router)

