const express = require("express");
const exphbs = require("express-handlebars");
const app = express();
const PORT = 8080;
const productsRouter = require("./routes/products.router");
const cartsRouter = require("./routes/carts.router");
const authRouter = require("./routes/auth.router.js");
const viewsRouter = require("./routes/views.router.js");
const helper = require("./helpers/helper.js");
const initializePassport = require("./config/passport.config.js");
const passport = require("passport");
const cookieParser = require("cookie-parser");


// initiate db
require("./database.js");
// initiate passport
initializePassport();


// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
// Handlebars config
app.engine(
  "handlebars",
  exphbs.engine({
    helpers: helper,
  })
);
app.set("view engine", "handlebars");
app.set("views", "src/views");

// Server init
const httpServer = app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});


// Routes
app.use("/api/products", productsRouter);
app.use("/api/cart", cartsRouter);
app.use("/api/auth", authRouter);
app.use("/views",   (req, res, next) => {
  req.httpServer = httpServer;
  next();
},viewsRouter);


