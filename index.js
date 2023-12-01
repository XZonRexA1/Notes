const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

require("dotenv").config();

const port = process.env.PORT || 5000;

const cors = require("cors");

const app = express();

// middleware
app.use(cors());
app.use(express.json());



const uri = process.env.USER_INFO;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});


async function run() {
  try {
    client.connect();

    // UserNote collection
    const userNoteCollection = client.db("userNote").collection("info");

    
        // Create a note
    app.post("/api/notes", async (req, res) => {
      const { text } = req.body;
      try {
        const result = await userNoteCollection.insertOne({ text });
        res.json({ _id: result.insertedId, text });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    // Read all notes
    app.get("/api/notes", async (req, res) => {
      try {
        const notes = await userNoteCollection
          .find()
          .sort({ text: -1 })
          .toArray();
        res.json(notes);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    // Update a note
    app.put("/api/notes/:id", async (req, res) => {
      const { id } = req.params;
      const { text } = req.body;
      try {
        const result = await userNoteCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { text } }
        );
        if (result.matchedCount === 0) {
          res.status(404).json({ error: "Note not found" });
        } else {
          res.json({ _id: id, text });
        }
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });
   
    // Delete a note
    app.delete("/api/notes/:id", async (req, res) => {
      const { id } = req.params;
      try {
        const result = await userNoteCollection.deleteOne({
          _id: new ObjectId(id),
        });
        if (result.deletedCount === 0) {
          res.status(404).json({ error: "Note not found" });
        } else {
          res.json({ _id: id });
        }
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Notes is running");
});

app.listen(port, () => {
  console.log(`Notes server is running on port ${port}`);
});
