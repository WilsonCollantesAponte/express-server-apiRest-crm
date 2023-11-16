const express = require("express");
const connection = require("../conexion/bd_conexion.jsx");
const router = express.Router();
const bcrypt = require("bcrypt");

router.post("/login", async (req, res) => {
  const { user, clave } = req.body;

  try {
    const results = await new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM users WHERE user = ?",
        [user],
        function (err, results) {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        }
      );
    });

    if (results.length === 0) {
      return res.status(200).json({ userExist: false, message: "Usuario no encontrado" });
    }

    const storedPassword = results[0].clave;

    // Comparación directa sin bcrypt (temporal, solo para depuración)
    const directComparison = clave === storedPassword;

    // Verificación con bcrypt
    const normalizedUserPassword = clave.normalize();
    const normalizedStoredPassword = storedPassword.normalize();
    bcrypt.compare(normalizedUserPassword, normalizedStoredPassword, (err, result) =>  {
      if (err) {
        console.error('Error al comparar contraseñas:', err);
      } else {
        if (result) {
          console.log('Contraseña correcta');
        } else {
          console.log('Contraseña incorrecta');
        }
      }
    });

  } catch (error) {
    console.error("Error en la consulta a la base de datos:", error);
    res.status(500).json({
      error: "Hubo un error en la consulta a la base de datos",
    });
  }
});

module.exports = router;
