import mysql.connector
import bcrypt

# -------------------------------
# CONFIGURACIÓN DE LA BASE DE DATOS
# -------------------------------
db_config = {
    "host": "localhost",
    "user": "root",                  # Cambia si tu usuario es diferente
    "password": "@RRHH2024GDZ",    # Tu contraseña MySQL
    "database": "UDH2024"
}

# -------------------------------
# INGRESO DE DATOS
# -------------------------------
usuario = input("👉 Ingresa el nombre de usuario: ")
nueva_password = input("👉 Ingresa la nueva contraseña en texto plano: ")

# -------------------------------
# ACTUALIZACIÓN O INSERCIÓN
# -------------------------------
try:
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor()

    # Crear hash de la nueva contraseña
    hashed = bcrypt.hashpw(nueva_password.encode('utf-8'), bcrypt.gensalt())

    # Intentar actualizar primero
    cursor.execute(
        "UPDATE usuarios SET password = %s WHERE usuario = %s",
        (hashed.decode('utf-8'), usuario)
    )
    conn.commit()

    if cursor.rowcount > 0:
        print(f"✅ Contraseña actualizada con bcrypt para el usuario '{usuario}'")
    else:
        # Si no existe, insertamos el usuario
        cursor.execute(
            "INSERT INTO usuarios (usuario, password) VALUES (%s, %s)",
            (usuario, hashed.decode('utf-8'))
        )
        conn.commit()
        print(f"🆕 Usuario '{usuario}' creado con contraseña encriptada.")

    cursor.close()
    conn.close()

except Exception as e:
    print("❌ Error al actualizar/crear el usuario:", e)

