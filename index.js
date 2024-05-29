const express = require("express");
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = 5000;


app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://abina:HIiGGA6OIoZs8G3Y@cluster0.948ms7y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try { 
        
        const database = client.db("itemsDB");
        const itemCollection = database.collection('items');

        app.get('/api/items', async (req, res) => {
            try {
                const cursor = await itemCollection.find().toArray();
                res.json(cursor);
            } catch (error) {
                console.log(error);
                res.status(500).send({ message: "Failed to fetch items", error });
            }
        });

       
        app.post('/api/items', async (req, res) => {
            const item = req.body;
            try {
                const result = await itemCollection.insertOne(item);
                res.send(result);
            } catch (error) {
                console.log(error);
                res.status(500).send({ message: "Failed to insert item", error });
            }
        });

        app.get('/api/items/:id', async (req, res) => {
            const singleId = req.params;
            const singleData = await itemCollection.findOne({ _id: new ObjectId(singleId) });
            res.send(singleData);
        })

        app.delete('/api/items/:id', async (req, res) => {
            const singleId = req.params;
            const singleDataDelete = await itemCollection.deleteOne({ _id: new ObjectId(singleId) });
            res.send(singleDataDelete);
        })

        app.put('/api/items/:id', async (req, res) => {
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

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        
    }
}
run();

app.get('/', (req, res) => {
    res.send('drawing and painting');
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
