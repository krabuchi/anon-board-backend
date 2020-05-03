import "dotenv/config";
import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import monk from "monk";

const app = express();

const db = monk("localhost/anonBoard");
const mess = db.get("mess");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    message: "Hello!",
  });
});

app.get("/messages", (req, res) => {
  mess.find().then((messages) => res.json(messages));
});

function isValidMessage(message) {
  const { name, content } = message;
  const na = name.toString().trim();
  const co = content.toString().trim();
  return name && na !== "" && content && co !== "";
}

app.post("/messages", (req, res) => {
  if (isValidMessage(req.body)) {
    const message = {
      name: req.body.name.toString(),
      content: req.body.content.toString(),
      created: new Date(),
    };
    mess.insert(message).then((createdMessage) => {
      res.json(createdMessage);
    });
  } else {
    res.status(422);
    res.json({
      message: "hey! name and content required",
    });
  }
});

app.listen(process.env.PORT, () => console.log("listening..."));
