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

    const passwordIsCorrect = await new Promise((resolve, reject) => {
      bcrypt.compare(clave, results[0].clave, (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });

    if (passwordIsCorrect) {
      // La contraseña es correcta, puedes redirigir al usuario a la parte correspondiente de tu aplicación
      res.status(200).json({
        userExist: true,
        userId: results[0].id,
        username: results[0].user,
        message: "Inicio de sesión exitoso",
      });
    } else {
      // La contraseña es incorrecta
      res.status(200).json({
        userExist: true,
        passwordIsCorrect: false,
        message: "Contraseña incorrecta",
      });
    }
  } catch (error) {
    console.error("Error en la consulta a la base de datos:", error);
    res.status(500).json({
      error: "Hubo un error en la consulta a la base de datos",
    });
  }
});

module.exports = router;
