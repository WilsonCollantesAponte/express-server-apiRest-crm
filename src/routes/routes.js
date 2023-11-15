const express = require("express");
const connection = require("../conexion/bd_conexion.jsx");
const router = express.Router();

router.post("/login", async (req, res) => {
  const { user, clave } = req.body;

  try {
    const results = await new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM users WHERE user = ? AND clave = ?",
        [user, clave],
        function (err, results) {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        }
      );
    });
    console.log(results);
    res.status(200).json(results);
  } catch (error) {
    console.error("Error en la consulta a la base de datos:", error);
    res.status(500).json({
      error: "Hubo un error en la consulta a la base de datos",
    });
  }
});

module.exports = router;
