const express = require('express')
const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors());
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z45ex.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run () {
    try{
        await client.connect();
        const database = client.db("motorcycleQuotes");
    const allMotorcycleCollection = database.collection("allMotorcycle");
    const allOrdersCollection = database.collection("allOrdersCollect");
    const allReviewCollection = database.collection("ReviewAll");
    const allUserCollection = database.collection("savedUsers");



    // add products 
    app.post('/addProducts', async (req,res)=>{
        const products = req.body;
        const result = await allMotorcycleCollection.insertOne(products);
        res.send(result)
    })

    // get products 
    app.get('/getProducts', async (req,res)=>{
        const result = await allMotorcycleCollection.find({}).toArray()
        res.send(result)
    })

    // get single products
    app.get('/singleProducts/:id', async (req,res)=>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)}
        const result = await allMotorcycleCollection.findOne(query)
        res.send(result);
    })


    // allOrders
    app.post('/allOrders', async (req,res)=>{
        const allOrders = req.body;
        const result = await allOrdersCollection.insertOne(allOrders)
        res.send(result);
       
    })


    // get my orders
    app.get('/myOrder/:email', async (req,res)=>{
        const result = await allOrdersCollection
      .find({ email: req.params.email })
      .toArray();
      res.json(result)
        

    })

    // delete my order
    app.delete('/deleteOrder/:id', async (req,res)=>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)}
        const result = await allOrdersCollection.deleteOne(query);
        res.send(result);
    })

    // customer review post
    app.post('/allReview', async (req,res)=>{
        const reviews = req.body;
        const result = await allReviewCollection.insertOne(reviews)
        res.send(result)
    })

    // customer review get
    app.get("/reviewGet", async (req,res)=>{
        const result = await allReviewCollection.find({}).toArray();
        res.send(result)
    })

    // get manage products
    app.get('/manageProducts', async (req,res)=>{
        const result = await allMotorcycleCollection.find({}).toArray();
        res.send(result)
    })

    // delete manage Products
    app.delete('/manProduct/:id', async (req,res)=>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)}
        const result = await allMotorcycleCollection.deleteOne(query);
        res.send(result);
    })

    // get manage all orders
    app.get('/manageOrder', async (req,res)=>{
        const result = await allOrdersCollection.find({}).toArray();
        res.send(result)
    })

    // delete manage orders
    app.delete('/manageOrderDelete/:id', async (req,res)=>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)}
        const result = await allOrdersCollection.deleteOne(query)
        res.send(result)
    })

    // update products status 
    app.put('/updateStatus/:id', async (req,res)=>{
        const id = req.params.id;
        const updateInfo = req.body;
        const query = {_id: ObjectId(id)}
        const result = await allOrdersCollection.updateOne(query,{
            $set: {
                status:updateInfo.status
            }
        })
        res.send(result)
    })


    // save User 
    app.post("/saveUsers", async (req,res)=>{
        const result = await allUserCollection.insertOne(req.body)
        res.send(result)
    })

    // make admin
    app.put("/madeAdmin", async (req,res)=>{
        const filter = {email: req.body.email}
        const result = await allUserCollection.find(filter).toArray()
        if(result){
            const update = await allUserCollection.updateOne(filter,{
                $set: {
                    role: "admin"
                }
            })
            res.send(update)
            
        }

        // admin confirm
        app.get('/adminConform/:email', async (req,res)=>{
            const result = await allUserCollection
            .find({ email: req.params.email})
            .toArray();
            res.json(result)
            console.log(result);
        })

        
    })

    }
    finally {
        // await client.close();
      }
}
run().catch(console.dir);

app.get('/', (req,res)=>{
    res.send('Database connected successfully!!!')
})

app.listen(port, ()=>{
    console.log('HEY connected database', port);
})


