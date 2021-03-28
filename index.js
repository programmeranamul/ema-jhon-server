const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser')
const cors = require('cors')


const uri = `mongodb+srv://emaWatson:sBgHHDG5xwOpvzrv@cluster0.5yvtj.mongodb.net/emaJhonStore?retryWrites=true&w=majority`;


const app = express()
app.use(bodyParser.json())
app.use(cors())

const port = 5000


require('dotenv').config()


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("emaJhonStore").collection("products");
  const ordersCollection = client.db("emaJhonStore").collection("orders");


  //add fake data to database
  app.post("/addProduct", (req, res) => {
    const product = req.body
    // console.log(product)
    productsCollection.insertMany(product)
      .then(result => {
        res.send(result.insertedCount > 0)
      })

  })

  // read fake data from data base

  app.get("/products", (req, res) => {
    productsCollection.find({})
    .toArray( (err, document) => {
      res.send(document)
    } )
  })

  //find single data from database
  app.get("/product/:key", (req, res) => {
    productsCollection.find({key: req.params.key})
    .toArray((err, document) => {
      res.send(document[0])
    } )
  })

  //load multipul data from database
  app.post('/productsByKeys', (req, res) => {
    const productKeys = req.body
    productsCollection.find({key: {$in: productKeys}})
    .toArray((err,documents) => {
      res.send(documents)
    })
  })

  //order 
  app.post('/addOrder', (req, res) => {
    const order = req.body
    ordersCollection.insertOne(order)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })




});


app.get("/", (req, res) => {
  res.send("hello word")
})

app.listen(port,() => {
  console.log("app started successfully")
})