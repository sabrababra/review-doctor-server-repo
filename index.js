const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json());

//middleWares
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_SERVICE}:${process.env.DB_PASSWORD}@cluster0.r5wfiz1.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const serviceCollection = client.db('healthcare').collection('services');
        const reviewsCollection = client.db('healthcare').collection('reviews');

        // get all services 
        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });

        // get single service 
        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });

        // get reviews for service
        app.get('/reviews', async (req, res) => {
            const id = req.query.id;
            const query = { service_id: parseInt(id) };
            const reviews = await reviewsCollection.find(query).toArray();
            res.send(reviews);
        });

        // get reviews for my reviews
        app.get('/myReviews', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const reviews = await reviewsCollection.find(query).toArray();
            res.send(reviews);
        });

        // add review 
        app.post('/reviews', async (req, res) => {
            const order = req.body;
            const result = await reviewsCollection.insertOne(order);
            res.send(result);
        });

        // update review 
        app.patch('/review/:id', async (req, res) => {
            const id = req.params.id;
            const data = req.body
            const query = { _id: ObjectId(id) }
            const updatedDoc = {
                $set: {
                    comment: data.comment,
                    rating: data.rating
                }
            }
            const result = await reviewsCollection.updateOne(query, updatedDoc);
            res.send(result);
        })

        // delete review
        app.delete('/review/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewsCollection.deleteOne(query);
            res.send(result);
        })



    }
    finally {

    }
}

run().catch(error => console.error(error));


app.get('/', (req, res) => {
    res.send('server run')
})

app.listen(port, () => {
    console.log('port run');
})

