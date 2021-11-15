import { Express } from "express";

export function setup(app: Express) {
  const WooCommerceAPI = require("@woocommerce/woocommerce-rest-api").default;
  const WooCommerce = new WooCommerceAPI({
    url: "https://myshop.gigya-cs.com/",
    version: "wc/v3",
    ...(require("./woocommerce.cred.json") as {
      consumerKey: string;
      consumerSecret: string;
    }),
  });

  let products;
  app.get("/products", async (req, res) => {
    if (!products)
      await WooCommerce.get("products").then((prod) => {
        // console.log('products', prod.data)
        products = prod.data;
      });

    res.status(200).json(products);
  });

  app.post("/customers", (req, res) => {
    console.log("server post customer");
    WooCommerce.post("customers", req.body).then((nCustomer) => {
      console.log("new customer", nCustomer);
      res.status(200).json(nCustomer);
    });
  });

  app.post("/orders", (req, res) => {
    console.log("server post order");
    WooCommerce.post("orders", req.body).then((ordersRes) => {
      console.log("ordersRes", ordersRes);
      res.status(200).json(ordersRes);
    });
  });
}
