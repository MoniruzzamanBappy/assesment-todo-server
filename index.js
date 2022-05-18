const express = require("express");

const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri =
  `mongodb+srv://${process.env.USER}:${process.env.PASS}@bappy-practice-db.nb2hg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const todoCollection = client.db("To-do-List").collection("todo");

    // get single user
    app.get("/todo", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await todoCollection.find(query).toArray();
      res.send(result);
    });

    // add user
    app.post("/todo", async (req, res) => {
      const newTodo = req.body;
      const result = await todoCollection.insertOne(newTodo);
      res.send(result);
    });

    // update user
    app.put("/todo/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const updatedTodo = req.body;
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          isComplete: updatedTodo.isComplete,
        },
      };
      const result = await todoCollection.updateOne(query, updateDoc, options);

      res.send(result);
    });

    // user delete
    app.delete("/todo/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await todoCollection.deleteOne(query);

      res.send(result);
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
