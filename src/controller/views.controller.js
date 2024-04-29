const CartsServices = require("../services/carts.services.js");
const cartsServices = new CartsServices();

const ProductsServices = require("../services/products.services.js");
const productsServices = new ProductsServices();

const TicketsService = require("../services/tickets.service.js");
const ticketsService = new TicketsService();

const ChatService = require("../services/chat.services.js");
const chatService = new ChatService();

const socket = require("socket.io");
const UserDto = require("../dto/user.dto.js");

class ViewsController {
  async renderCart(req, res) {
    const user = req.user;
    const dtoUser = new UserDto(user);
    try {
      const userCartId = req.user.cart;
      const newCart = await cartsServices.getCartById(userCartId, true);
      res.render("cart", {
        cart: JSON.stringify(newCart),
        active: { cart: true },
        user: dtoUser,
      });
    } catch (err) {
      console.log("err:", err);
      res.status(500).json({ message: "Server problems" });
    }
  }

  async renderProducts(req, res) {
    const user = req.user;
    const dtoUser = new UserDto(user);
    try {
      const products = await productsServices.getProducts(req.query);
      res.render("products", {
        products: products,
        active: { products: true },
        user: dtoUser,
      });
    } catch (err) {
      console.log("entre ene error");
      res.status(500).json({ error: err });
    }
  }

  async renderProduct(req, res) {
    const id = req.query.id;
    const user = req.user;
    const dtoUser = new UserDto(user);
    try {
      const product = await productsServices.getProductById(id);
      res.render("product", {
        product: product,
        user: dtoUser,
      });
    } catch (err) {
      res.status(500).json({ error: err });
    }
  }

  async renderLogin(req, res) {
    const error = req.query.error;
    try {
      if (error != undefined) {
        res.render("login", { error: true });
      } else {
        res.render("login");
      }
    } catch (err) {
      res.status(500).json({ error: err });
    }
  }

  async renderRegister(req, res) {
    const error = req.query.error;
    try {
      if (req.user) {
        return res.redirect("/views/products");
      }
      if (error != undefined) {
        res.render("register", { error: true });
      } else {
        res.render("register");
      }
    } catch (err) {
      res.status(500).json({ error: err });
    }
  }

  async renderRealtimeProducts(req, res) {
    var httpServer = req.httpServer;
    const io = socket(httpServer);
    const user = req.user;
    const dtoUser = new UserDto(user);
    try {
      io.on("connection", async (socket) => {
        socket.emit("products", await productsServices.getProductsNoPaginate());

        socket.on("deleteProduct", async (id) => {
          await productsServices.deleteProductById(id);
          io.sockets.emit(
            "products",
            await productsServices.getProductsNoPaginate()
          );
        });

        socket.on("addProduct", async (newProduct) => {
          const addResponse = await productsServices.addProduct(newProduct);
          if (addResponse == false) {
            console.log("server product already Exists");
            io.sockets.emit("products", false);
          } else {
            console.log("hice bien el producto!!");
            await new Promise((resolve) => {
              setTimeout(resolve, 300);
            });
            const products = await productsServices.getProductsNoPaginate();
            console.log("products in server:", products);
            io.sockets.emit("products", products);
          }
        });

        socket.on("updateProduct", async (args) => {
          console.log("argssss:", args);
          const updateResponse = await productsServices.updateProduct(
            args.productId,
            args.productData
          );
          io.sockets.emit(
            "products",
            await productsServices.getProductsNoPaginate()
          );
        });
      });
      res.render("realtimeproducts", {
        user: dtoUser,
        active: { realtime_products: true },
      });
    } catch (err) {
      res.status(500).json({ error: "server error" });
    }
  }

  async renderProfile(req, res) {
    try {
      const user = req.user;
      const dtoUser = new UserDto(user);
      res.render("profile", { user: req.user, active: { profile: true } });
    } catch (err) {
      console.log("err:", err);
      res.status(500).json({ error: "server error" });
    }
  }

  async renderTicket(req, res) {
    console.log("entre en renderTicket");
    const { tId } = req.query;
    try {
      const user = req.user;
      const dtoUser = new UserDto(user);
      const ticket = await ticketsService.getTicketById(tId);
      console.log("ticket en renderTicket:", ticket);
      res.render("ticket", { user: dtoUser, ticket: ticket });
    } catch (err) {
      console.log("err:", err);
      res.status(500).json({ error: "server error" });
    }
  }

  async renderChat(req, res) {
    var httpServer = req.httpServer;
    const io = socket(httpServer);
    const user = req.user;
    const dtoUser = new UserDto(user);
    try {
      io.on("connection", (socket) => {
        console.log("Initiating CHAT websocket connection");
        socket.on("chat", async () => {
          const chat = await chatService.getChat();
          io.emit("chat", chat);
        });

        socket.on("newMessage", async (newMessage) => {
          await chatService.addMessageToChat(newMessage);
          const newChat = await chatService.getChat();
          io.emit("chat", newChat);
        });
      });

      res.render("chat", { active: { chat: true }, user: dtoUser });
    } catch (err) {
      res.status(500).json({ error: "server error" });
    }
  }

  async test(req, res) {
    res.render("test", { user: req.user, active: { test: true } });
  }
}

module.exports = ViewsController;
