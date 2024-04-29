const ProductsRepository = require("../repositories/products.repository.js");
const productsRepository = new ProductsRepository();
const { handleQueryString, checkNewProduct } = require("../utils/utils.js");

class ProductsService {
  async getProducts(queryObject) {
    const limit = queryObject.limit;
    const page = queryObject.page;
    const sort = queryObject.sort;
    const query = queryObject.query;
    let products;
    let args = {
      limit: limit || 10,
      page: page || 1,
      lean: true,
    };
    if (sort) {
      args.sort = { price: sort };
    }
    if (query) {
      products = await productsRepository.getProducts(
        { category: query },
        args
      );
    } else {
      products = await productsRepository.getProducts({}, args);
    }

    products.prevLink = handleQueryString(queryObject, products.prevPage);
    products.nextLink = handleQueryString(queryObject, products.nextPage);
    return products;
  }

  async getProductsNoPaginate() {
    const products = await productsRepository.getProductsNoPaginate();
    return products;
  }

  async getProductById(id) {
    const product = await productsRepository.getProductById(id);
    if (!product) {
      throw "Product not found";
    }
    console.log("Producto encontrado");
    return product;
  }

  async deleteProductById(id) {
    return await productsRepository.deleteProductById(id);
  }

  async addProduct(newProduct) {
    if (!checkNewProduct(newProduct)) {
      throw "All fields are required. Product invalid";
    }
    const productExists = await productsRepository.getProductByCode(
      newProduct.code
    );
    console.log("productExists:", productExists);
    if (productExists) {
      return false;
    }
    const product = await productsRepository.addProduct(newProduct);
    return product;
  }

  async updateProduct(id, productData) {
    return await productsRepository.updateProduct(id, productData);
  }
}

module.exports = ProductsService;
