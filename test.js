const express = require('express');
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
var cors = require('cors')
// MongoDB connection URI and client setup
const uri = "mongodb+srv://yuvaraj:yuvidatabase03@cluster0.tqt9nzo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  } 
});

// Initialize the Express app
const app = express();
const port = process.env.PORT || 3000;

app.use(cors())
  
// Middleware
app.use(express.json());

// Connect once and reuse DB
let usersCollection;
async function initDB() {
  await client.connect();
  const database = client.db("zomato");
  usersCollection = database.collection("user");
}
initDB();

// ✅ CREATE user
app.post('/register', async (req, res) => {
  try {
    const result = await usersCollection.insertOne(req.body);
    res.status(201).json({ insertedId: result.insertedId });
  } catch (error) {
    console.error("Error inserting user:", error);
    res.status(500).send("Internal Server Error");
  }
});

// ✅ READ (list all users)
app.get('/users', async (req, res) => {
  try {
    const users = await usersCollection.find().toArray();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send("Internal Server Error");
  }
});

// ✅ UPDATE user
app.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send("Invalid ID format");
    }

    const result = await usersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: req.body }
    );

    if (result.matchedCount === 0) {
      return res.status(404).send("User not found");
    }

    res.status(200).send("User updated successfully");
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send("Internal Server Error");
  }
});

// DELETE user
app.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send("Invalid ID format");
    }

    const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).send("User not found");
    }

    res.status(200).send("User deleted successfully");
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Start server
app.listen(port, () => {
  console.log( `Server is running on port ${port}`);
});
