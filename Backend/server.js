const express = require("express");
const app = express();
const cors = require("cors");
const port = 8080;


//Middleware
app.use(express.json()); //for parsing application/json
app.use(cors()); //for configuring Cross-Origin Resource Sharing (CORS)
function log(req, res, next) {
    console.log(req.method + " Request at" + req.url);
    next();
}
app.use(log);


require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');
const url = process.env.COSMOS_CONNECTION_STRING;
const client = new MongoClient(url);
let collection;

async function main(){

    await client.connect();

    const db = client.db(`prof`);

    console.log(`New database:\t${db.databaseName}\n`);

    collection = db.collection('rated');

    console.log(`New Rated:\t${collection.collectionName}\n`);

    }
    
    main()



//Endpoints
app.get("/profs", async function (req, res) {

    const profs = await getAll();

    res.writeHead(200, {
            "Content-Type" : "application/json",
    });
    res.end(JSON.stringify(profs));
});
async function getAll(){
    const allProductsQuery ={};

    const profs = await collection.find(allProductsQuery).sort({name:1}).toArray();
    profs.map((prof, i) => console.log(`${++i} ${JSON.stringify(prof)}`));
    return profs;
}

app.get("/profs/:id", async function (req, res) {
//hat nicht mehr geklappt mit der zeit
});

app.put("/profs/:id", async function (req, res) {
   const profId = req.params.id;

   const query ={}
   let queryResult = await collection.find(query).toArray();

   const shouldDelete = queryResult[profId];                    //keine zeit mehr das richtig zu machen

   await collection.deleteOne({ id: shouldDelete.id});

   queryResult = await collection.find(query).toArray();
   res.status(200).send(queryResult);
});

app.delete("/profs/:id", async function (req, res) {
   const profId = req.params.id;

   const query = {}

   let queryResult = await collection.find(query).toArray();
   const shouldDelete = queryResult[profId];
   console.log(shouldDelete);                                       //keine zeit mehr gehabt es richtig zum laufen zum bringen

   await collection.deleteOne({ id: shouldDelete.id});

   queryResult = await collection.find(query).toArray();
   res.status(200).send(queryResult);


});

app.post("/profs", async function (req, res) {

    const doc = {
        name: req.body.name,
        rating: req.body.rating
    }

    const result = await collection.insertOne(doc);
    console.log(`A document was inserted with the _id: ${result.insertedId}`);

    const profs = await getAll();

    res.writeHead(200, {
        "Content-Type" : "application/json",
});
res.end(JSON.stringify(profs));
});


app.listen(port, () => console.log(`Server listening on port ${port}!`));