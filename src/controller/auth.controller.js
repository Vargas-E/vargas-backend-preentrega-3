const jwt = require("jsonwebtoken");

class AuthController {
  async login(req, res) {
    try {
      const userForToken = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email,
        rol: req.user.rol,
        cart: req.user.cart,
      };

      const token = jwt.sign(userForToken, "coderhouse", { expiresIn: "1h" });

      res.cookie("coderCookieToken", token, {
        maxAge: 3600000,
        httpOnly: true,
      });
      if (userForToken.rol == "admin") {
        res.redirect("/views/realtime_products");

      } else {
        res.redirect("/views/products");

      }
    } catch (error) {
      console.log("error_:", error);
      res.status(400).send({ error: "Error en el login" });
    }
  }

  async register(req, res) {
    const { first_name, last_name, email, password, age } = req.body;
    try {
      const userForToken = {
        first_name: first_name,
        last_name: last_name,
        age: age,
        email: email,
        rol: "user",
        cart: req.user.cart,
      };

      // generamos token JWT
      const token = jwt.sign(userForToken, "coderhouse", { expiresIn: "1h" });

      // mandamos como cookie el token
      res.cookie("coderCookieToken", token, {
        maxAge: 3600000,
        httpOnly: true,
      });

      res.redirect("/views/products");
    } catch (error) {
      console.log("Error al crear el usuario:", error);
      res.status(500).send({ error: "Error al guardar el usuario nuevo" });
    }
  }

  async github(req, res) {}

  async githubcallback(req, res) {
    try {
      const userForToken = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email,
        rol: req.user.rol,
        cart: req.user.cart,
      };

      const token = jwt.sign(userForToken, "coderhouse", { expiresIn: "1h" });

      res.cookie("coderCookieToken", token, {
        maxAge: 3600000,
        httpOnly: true,
      });

      res.redirect("/views/products");
    } catch (err) {
      console.log("error_:", error);
      res.status(400).send({ error: "Error en el login" });
    }
  }

  async logout(req, res) {
    try {
      res.clearCookie("coderCookieToken");
      res.redirect("/views/login");
    } catch (err) {
      console.log("error_:", error);
      res.status(400).send({ error: "Error en el login" });
    }
  }

  async current(req, res) {
    try {
      res.send({ user: req.user });
    } catch (err) {
      console.log("error_:", error);
      res.status(400).send({ error: "Error en el login" });
    }
  }
}

module.exports = AuthController;
