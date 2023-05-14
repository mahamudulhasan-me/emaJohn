const express = require("express");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

const mainRoute = express.Router();

mainRoute.get("/", (req, res) => {
  res.send("Ema John is now on fire!");
});
const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASSWORD}@cluster0.beeiwwt.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const emaJohnDB = client.db("emaJohnDB");
    const productCollection = emaJohnDB.collection("products");

    // get product
    mainRoute.get("/products", async (req, res) => {
      const product = await productCollection.find().toArray();
      res.send(product);
    });
    // get total products
    mainRoute.get("/totalProducts", async (req, res) => {
      const numOfProducts = await productCollection.countDocuments();
      res.send({ totalProducts: numOfProducts });
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

module.exports = mainRoute;
