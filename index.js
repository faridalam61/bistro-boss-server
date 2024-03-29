const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()


// Middlewares

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.se8uzie.mongodb.net/?retryWrites=true&w=majority`;

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

    const menuCollection = client.db("bistroBoss").collection("menu");
    const cartCollection = client.db("bistroBoss").collection("carts");
    const usersCollection = client.db("bistroBoss").collection("users");

    

    app.get('/menus',async (req,res)=>{
        const result = await menuCollection.find().toArray();
        res.send(result)
    })

    // Carts

    app.post('/carts', async (req,res)=>{
      const query = req.body;
      const result = await cartCollection.insertOne(query)
      res.send(result)
    }) 
// Get carts
app.get('/carts',async (req,res)=>{
  const email = req.query.email;
  if(!email){
    res.send([])
  } 

  const query = {email : email}
  const resutl = await cartCollection.find(query).toArray()
  res.send(resutl)
})

// Delete cart item
app.delete('/carts/:id', async (req,res)=>{
  const id = req.params.id;
  const query = {_id : new ObjectId(id)}
  const result = await cartCollection.deleteOne(query);
  res.send(result)
})

// Save user
app.post('/users', async (req,res)=>{
  const user = req.body;
  const result = await usersCollection.insertOne(user)
  res.send(result);
})

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);




app.get('/',(req,res)=>{
    res.send('Server is running...')
})

app.listen(port, ()=>{
    console.log('App is running on the port ',port)
})