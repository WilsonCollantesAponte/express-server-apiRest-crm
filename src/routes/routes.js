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
        // "SELECT * FROM users WHERE user = ? AND clave = ?",
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

    if (results.length === 0) return res.status(200).json({ userExist: false });

    const passwordIsCorrect = await new Promise((resolve, reject) => {
      bcrypt.compare(clave, results[0].clave, (err, result) => {
        if (err) reject(err);
        if (result) resolve(result);
        else resolve(result);
      });
    });

    //Responde con informacón que determina si existe un usuario y clave
    res
      .status(200)
      .json({ userExist: results.length !== 0, passwordIsCorrect });
  } catch (error) {
    console.error("Error en la consulta a la base de datos:", error);
    res.status(500).json({
      error: "Hubo un error en la consulta a la base de datos",
    });
  }
});

module.exports = router;
