# Backend/hash_password.py
# Script para actualizar/crear usuario con contraseña hasheada (bcrypt)
#  se usa Úsalo terminal: python hash_password.py

from db_config import db_config
import mysql.connector
import bcrypt
from mysql.connector import Error as MySQLError

usuario = input("👉 Ingresa el nombre de usuario: ").strip()
nueva_password = input("👉 Ingresa la nueva contraseña en texto plano: ").strip()

conn = None
cursor = None
try:
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor()

    # Crear hash
    hashed = bcrypt.hashpw(nueva_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    # Primero intentar actualizar existente
    cursor.execute(
        "UPDATE usuarios SET password = %s WHERE usuario = %s",
        (hashed, usuario)
    )
    conn.commit()

    if cursor.rowcount > 0:
        print(f"✅ Contraseña actualizada con bcrypt para el usuario '{usuario}'")
    else:
        # Si no existe, insertarlo
        cursor.execute(
            "INSERT INTO usuarios (usuario, password) VALUES (%s, %s)",
            (usuario, hashed)
        )
        conn.commit()
        print(f"🆕 Usuario '{usuario}' creado con contraseña encriptada.")

except MySQLError as e:
    print("❌ Error de DB:", e)

finally:
    try:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
    except:
        pass
