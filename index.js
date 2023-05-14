const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

require('dotenv').config()
// console.log(process.env.DB_UserName)
// console.log(process.env.DB_Secret)


const app = express();
const port = process.env.PORT || 5009;

// Middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_UserName}:${process.env.DB_Secret}@cluster0.bsjngpi.mongodb.net/?retryWrites=true&w=majority`;



// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // Insert a document into the MongoDB database
    const coffeeCollections = client.db('coffeeDB').collection('coffees');


    // Get data from UI and send it to MongoDB
    app.post('/coffee', async (req, res) => {
        const newCoffee = req.body;
        console.log(newCoffee);
        const result = await coffeeCollections.insertOne(newCoffee);
        console.log(result);
        res.send(result);
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// End MongoDB configuration

app.get('/', (req, res) => {
    res.send('Coffee server is running')
})

app.listen(port, (err, res) => {
    console.log(`Coffee server is running on ${port}`)
})