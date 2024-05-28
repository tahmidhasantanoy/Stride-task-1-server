// tZoEafpceCmBR4DD
// Stride_task

const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors()); //cors policy
app.use(express.json()); //request body parser

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oc9fgut.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    const productsCollection = client
      .db("Stride_task")
      .collection("all-product");

    app.get("/get-all-product", async (req, res) => {
      const cursor = productsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // Find a single item
    app.get("/get-single-product/:queryId", async (req, res) => {
      const id = req.params.queryId;
      const query = { _id: new ObjectId(id) };
      console.log(query);
      const result = await productsCollection.findOne(query);
      res.send(result);
    });

    // Upload products data
    app.post("/all-product", async (req, res) => {
      const addProductData = req.body;

      //server to db
      const result = await productsCollection.insertOne(addProductData);
      res.send(result);
    });

    // update one product
    app.put("/update-single-product/:updateId", async (req, res) => {
      const id = req.params.updateId;

      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateProductInfo = req.body;
      const updateDoc = {
        $set: {
          productTitle: updateProductInfo.productTitle,
          imageUrl: updateProductInfo.imageUrl,
          price: updateProductInfo.price,
          description: updateProductInfo.description,
          date: updateProductInfo.date,
        },
      };

      const result = await productsCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    app.delete("/delete-product/:deleteId", async (req, res) => {
      const id = req.body.deleteId;
      const queryId = { _id: new ObjectId(id) };

      console.log(queryId);

      const result = await productsCollection.deleteOne(queryId);
      res.send(result);
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

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
