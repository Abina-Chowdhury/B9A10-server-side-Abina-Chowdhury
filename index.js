const express = require("express");
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://abina:HIiGGA6OIoZs8G3Y@cluster0.948ms7y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
        // Connect the client to the server (optional starting in v4.7)
        await client.connect();

        const database = client.db("itemsDB");
        const itemCollection = database.collection('items');

        // Handle GET request to fetch items
        app.get('/items', async (req, res) => {
            console.log('/items api get korteci');
            try {
                const cursor = await itemCollection.find().toArray();
                res.json(cursor);
            } catch (error) {
                console.log(error);
                res.status(500).send({ message: "Failed to fetch items", error });
            }
        });

        // Handle POST request to insert an item
        app.post('/items', async (req, res) => {
            console.log('/items api post korteci');

            const item = req.body;
            try {
                const result = await itemCollection.insertOne(item);
                console.log(result);
                res.send(result);
            } catch (error) {
                console.log(error);
                res.status(500).send({ message: "Failed to insert item", error });
            }

        });

        app.get('/items/:id', async (req, res) => {
            console.log('/items/:id api get korteci');

            const singleId = req.params;
            const singleData = await itemCollection.findOne({ _id: new ObjectId(singleId) });
            res.send(singleData);
        })

        app.delete('/items/:id', async (req, res) => {
            console.log('/items/:id api delete korteci');

            const singleId = req.params;
            const singleDataDelete = await itemCollection.deleteOne({ _id: new ObjectId(singleId) });
            res.send(singleDataDelete);
        })

        app.put('/items/:id', async (req, res) => {
            console.log('/items/:id api update korteci');
            const singleId = req.params.id;
            const updatedItem = req.body;
            const singleDataUpdate = await itemCollection.updateOne(
                { _id: new ObjectId(singleId) }, // filter
                {
                    $set: {
                        ...updatedItem
                    }
                }
            );
            res.send({
                success: true,
                massage: `item with this id ${singleId} updated  successfully`,
                data: singleDataUpdate

            });
        })



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run();

app.get('/', (req, res) => {
    res.send('drawing and painting');
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
