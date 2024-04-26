const ProductsService = require("../services/products.services.js");
const productsService = new ProductsService();

class ProductController {
  async getProducts(req, res) {
    try {
      const products = await productsService.getProducts(req.query);
      res.status(200).json(products);
    } catch (err) {
      console.log("err:", err);
      res.status(500).json({ Error: "Error when fetching products" });
    }
  }

  async getProductById(req, res) {
    const { pid } = req.params;
    try {
      const product = await productsService.getProductById(pid);
      res.status(200).json(product);
    } catch (err) {
      console.log("err:", err);
      res.status(500).json({ Error: "Error when fetching product" });
    }
  }

  async deleteProductById(req, res) {
    const { pid } = req.params;
    try {
      const product = await productsService.deleteProductById(pid);
      res.status(200).json({ message: `Product with id ${pid} deleted` });
    } catch (err) {
      console.log("err:", err);
      res.status(500).json({ Error: "Error when fetching product" });
    }
  }

  async addProduct(req, res) {
    const newProduct = req.body;
    try {
      const response = await productsService.addProduct(newProduct);
      res.status(201).json({ response });
    } catch (err) {
      console.log("err:", err);
      res.status(500).json({ Error: "Error when fetching product" });
    }
  }

  async updateProduct(req, res) {
    const { pid } = req.params;
    const newProductValues = req.body;
    if (pid != undefined && newProductValues) {
      try {
        await productsService.updateProduct(pid, newProductValues);
        res.status(201).json({ message: `Product with id ${pid} updated` });
      } catch (err) {
        res.status(500).json({ error: "Error de servidor" });
      }
    } else {
      res.json({ message: err });
    }
  }
}

module.exports = ProductController;
