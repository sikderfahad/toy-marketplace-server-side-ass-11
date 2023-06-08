const express = require("express");
const cors = require("cors");
require("dotenv").config();
const data = require("./data.json");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
console.log(process.env.DB_USER);

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3zuhxgd.mongodb.net/?retryWrites=true&w=majority`;

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
    client.connect();

    const database = client.db("toy-shop");
    const homeToysCollection = database.collection("homeToyes");
    const addUserToyCollection = database.collection("userAddedToy");

    // READ  =>  get all home page display Toy
    app.get("/toyes", async (req, res) => {
      const result = await homeToysCollection.find().toArray();
      res.send(result);
    });

    // READ  =>  get a single home page display Toy
    app.get("/toyes/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await homeToysCollection.findOne(query);
      res.send(result);
    });

    // CREATE  =>  add new toy by user
    app.post("/addToy", async (req, res) => {
      const toy = req.body;
      const result = await addUserToyCollection.insertOne(toy);
      res.send(result);
      console.log(toy);
    });

    // READ  some of data for specific user
    app.get("/userAllToys", async (req, res) => {
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email };
      }

      const result = await addUserToyCollection.find(query).toArray();
      res.send(result);
      console.log(result);
    });

    // READ  all user toy data
    app.get("/allToys", async (req, res) => {
      const result = await addUserToyCollection.find().toArray();
      res.send(result);
    });

    // READ  a single user created toy
    app.get("/allToys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await addUserToyCollection.findOne(query);
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
  res.send("Toyes server is Running...!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
