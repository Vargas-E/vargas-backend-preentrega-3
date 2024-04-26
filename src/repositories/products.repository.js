const ProductModel = require("../models/product.model");

class ProductsRepository {
  async getProducts(query, args) {
    try {
      const products = await ProductModel.paginate(query, args);
      return products;
    } catch (err) {
      throw new Error(`Error mongo (get products): ${err}`);
    }
  }

  async getProductById(id) {
    try {
      const product = await ProductModel.findById(id).lean();
      return product;
    } catch (err) {
      console.log("Error al buscar producto:", err);
      throw new Error(`Error mongo (get product): ${err}`);
    }
  }

  
  async getProductByIdNoLean(id) {
    try {
      const product = await ProductModel.findById(id);
      return product;
    } catch (err) {
      console.log("Error al buscar producto:", err);
      throw new Error(`Error mongo (get product): ${err}`);
    }
  }

  async getProductByCode(code) {
    try {
      const product = await ProductModel.findOne({ code: code });
      return product;
    } catch (err) {
      console.log("Error al buscar producto:", err);
      throw new Error(`Error mongo (get product): ${err}`);
    }
  }

  async deleteProductById(id) {
    try {
      const deleteProduct = await ProductModel.findByIdAndDelete(id);
      if (!deleteProduct) {
        throw "Product to delete not found";
      }
      console.log("Producto eliminado");
    } catch (err) {
      console.log("Error al actualizar producto:", err);
      throw new Error(`Error mongo (delete products): ${err}`);
    }
  }

  async addProduct(newProduct) {
    try {
      const product = new ProductModel({
        ...newProduct,
        status: true,
        thumbnails: newProduct.thumbnails || [],
      });
      product.save();
      return newProduct;
    } catch (err) {
      console.log("Error al agregar producto:", err);
      throw new Error(`Error mongo (add product): ${err}`);
    }
  }

  async updateProduct(id, productData) {
    try {
      const newProduct = await ProductModel.findByIdAndUpdate(id, productData);
      if (!newProduct) {
        throw "Product to update not found";
      }
      console.log("Producto actualizado");
      return newProduct;
    } catch (err) {
      console.log("Error al editar producto:", err);
      throw new Error(`Error mongo (update product): ${err}`);
    }
  }
}

module.exports = ProductsRepository;
