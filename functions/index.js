const functions = require("firebase-functions");
const {
  Login,
  GetQuestion,
  SubmitAnswer,
  UploadAnswerS3,
} = require("./src/controllers");
const services = require("./src/services");
const cron = require("node-cron");
const express = require("express");
const app = express();
var bodyParser = require("body-parser");
var cors = require('cors')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

require("dotenv").config();

app.use(cors())

var task = cron.schedule("50 23 * * *", async () => {
  try {
    const result = await services.UploadAnswers();
    if (result.isSuccess) {
      console.log("Upload Success");
    } else {
      console.error("Upload Failed");
    }
  } catch (error) {
    console.error("An error occurred while submit answer.", error);
  }
});

const port = process.env.FUNCTION_PORT || 3001;

app.get("/", (req, res) => {
  res.send(`Api is running.New version 1.0.1`);
});
app.post("/login", Login);
app.get("/questions", GetQuestion);
app.post("/submit-answer", SubmitAnswer);
app.get("/uploadS3", UploadAnswerS3);
app.get('/download/:id', function(req, res){
  const file = `./public/Reward/Reward${req.params.id ?? 1}.webp`;
  const stream = require('fs').createReadStream(file);
  res.header('Content-Disposition', 'attachment; filename=Reward' + req.params.id + '.webp');
  res.header('Content-Type', 'image/webp');
  res.send(stream).type('image/webp').code(200);
});

// Define your Cloud Function using the Express app
const api = functions.https.onRequest(app);

module.exports = { api };
