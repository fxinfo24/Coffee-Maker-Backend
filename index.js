const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5009;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_UserName}:${process.env.DB_Secret}@cluster0.bsjngpi.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect to MongoDB
    await client.connect();
    const coffeeCollections = client.db('coffeeDB').collection('coffees');

    // GET all coffees
    app.get('/coffee', async (req, res) => {
      const coffeeData = await coffeeCollections.find().toArray();
      res.send(coffeeData);
    });

    // GET a specific coffee by ID
    app.get('/coffee/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollections.findOne(query);
      res.send(result);
    });

    // POST a new coffee
    app.post('/coffee', async (req, res) => {
      const newCoffee = req.body;
      const result = await coffeeCollections.insertOne(newCoffee);
      res.send(result);
    });

    // PUT/UPDATE a coffee by ID
    app.put('/coffee/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedCoffee = req.body;
      const Coffee = {
        $set: {
          name: updatedCoffee.name,
          chef: updatedCoffee.chef,
          supplier: updatedCoffee.supplier,
          taste: updatedCoffee.taste,
          category: updatedCoffee.category,
          details: updatedCoffee.details,
          photo: updatedCoffee.photo,
          quantity: updatedCoffee.quantity,
        },
      };
      const result = await coffeeCollections.updateOne(query, Coffee, options);
      res.send(result);
    });

    // DELETE a coffee by ID
    app.delete('/coffee/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollections.deleteOne(query);
      res.send(result);
    });

    // Ping MongoDB to confirm successful connection
    await client.db('admin').command({ ping: 1 });
    console.log('Pinged your deployment. You successfully connected to MongoDB!');
  } finally {
    // Close the MongoDB connection
    // await client.close();
  }
}

run().catch(console.dir);

// Default route
app.get('/', (req, res) => {
  res.send('Coffee server is running');
});

// Start the server
app.listen(port, (err, res) => {
  console.log(`Coffee server is running on ${port}`);
});
