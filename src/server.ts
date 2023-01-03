import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { Client } from "pg";
import { getEnvVarOrFail } from "./support/envVarUtils";
import { setupDBClientConfig } from "./support/setupDBClientConfig";

dotenv.config(); //Read .env file lines as though they were env vars.

const dbClientConfig = setupDBClientConfig();
const client = new Client(dbClientConfig);

//Configure express routes
const app = express();

app.use(express.json()); //add JSON body parser to each following route handler
app.use(cors()); //add CORS support to each following route handler

app.get("/", async (req, res) => {
  res.json({ msg: "Hello! There's nothing interesting for GET /" });
});

app.get("/pastes", async (req, res) => {
  try {
    const query = "SELECT * FROM pastes";
    const response = await client.query(query);
    const rows = response.rows;
    res.send(rows);
  } catch (error) {
    console.error(error);
  }
});

app.post("/pastes", async (req, res) => {
  try {
    const body = req.body;
    const query = "INSERT INTO pastes (title, body) VALUES ($1,$2) RETURNING *";
    await client.query(query, [body.title, body.body]);
    res.status(200).send("Item added");
  } catch (error) {
    console.error(error);
  }
});

app.delete("/pastes/:id", async (req, res) => {
  try {
    const query = "DELETE FROM pastes WHERE id=$1";
    const id = req.params.id;
    await client.query(query, [id]);
    res.status(200).send("Item deleted");
  } catch (error) {
    console.error(error);
  }
});

connectToDBAndStartListening();

async function connectToDBAndStartListening() {
  console.log("Attempting to connect to db");
  await client.connect();
  console.log("Connected to db!");

  const port = getEnvVarOrFail("PORT");
  app.listen(port, () => {
    console.log(
      `Server started listening for HTTP requests on port ${port}.  Let's go!`
    );
  });
}
