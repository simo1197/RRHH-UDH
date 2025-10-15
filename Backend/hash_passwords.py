# Backend/hash_password.py
"""
Script para convertir contraseñas en texto plano a bcrypt en la tabla 'usuario'.
Recomendado ejecutar como módulo desde la raíz del proyecto:
    python -m Backend.hash_password

El script:
 - Encuentra usuarios cuya columna 'clave' NO comienza con '$2'
 - Genera bcrypt (cost 12) y actualiza la fila correspondiente
 - Muestra resumen

Además exporta la función make_bcrypt_hash(password) para generar hashes desde otros módulos.
"""

from .db_config import db_config
import mysql.connector
import bcrypt
from mysql.connector import Error as MySQLError

def get_conn():
    return mysql.connector.connect(**db_config)

def make_bcrypt_hash(password_plain: str, rounds: int = 12) -> str:
    """
    Genera un hash bcrypt (como string) a partir de la contraseña en texto plano.
    rounds: coste (12 es razonable para pruebas/producción moderada).
    """
    if password_plain is None:
        raise ValueError("password_plain no puede ser None")
    hashed = bcrypt.hashpw(password_plain.encode('utf-8'), bcrypt.gensalt(rounds))
    return hashed.decode('utf-8')

def is_bcrypt_hash(s):
    if not s:
        return False
    try:
        if isinstance(s, (bytes, bytearray)):
            s = s.decode('utf-8', errors='ignore')
        return s.startswith("$2")
    except Exception:
        return False

def main():
    conn = None
    cur = None
    try:
        conn = get_conn()
        cur = conn.cursor(dictionary=True)

        # Seleccionar usuarios con clave no bcrypt (o nula)
        cur.execute("SELECT id, usuario, clave FROM usuario")
        rows = cur.fetchall()
        to_update = []
        for r in rows:
            clave = r.get("clave")
            if is_bcrypt_hash(clave):
                continue
            # Si está vacío o NULL, saltarlo (puedes tratarlo aparte)
            if clave is None:
                print(f"[SKIP] usuario '{r['usuario']}' tiene clave NULL. No se modifica.")
                continue
            # Si es memoryview/bytes, convertir a str
            if isinstance(clave, (bytes, bytearray, memoryview)):
                try:
                    clave_str = bytes(clave).decode('utf-8', errors='ignore')
                except Exception:
                    clave_str = str(clave)
            else:
                clave_str = str(clave)

            if clave_str.strip() == "":
                print(f"[SKIP] usuario '{r['usuario']}' clave vacía.")
                continue

            to_update.append((r['id'], r['usuario'], clave_str))

        if not to_update:
            print("No se encontraron contraseñas en texto plano para actualizar.")
            return

        print(f"Se actualizarán {len(to_update)} usuarios a bcrypt.")
        for uid, username, plain in to_update:
            hashed = bcrypt.hashpw(plain.encode('utf-8'), bcrypt.gensalt(12))
            # Actualizar (guardamos como bytes o string; decodificamos a string para consistencia)
            cur2 = conn.cursor()
            cur2.execute("UPDATE usuario SET clave = %s, updated_at = NOW() WHERE id = %s", (hashed.decode('utf-8'), uid))
            conn.commit()
            cur2.close()
            print(f"[OK] Usuario '{username}' (id={uid}) actualizado a bcrypt.")

    except MySQLError as e:
        print("DB error:", e)
    finally:
        try:
            if cur:
                cur.close()
            if conn:
                conn.close()
        except:
            pass

if __name__ == "__main__":
    main()




