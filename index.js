const {
    Login,
    GetQuestion,
    SubmitAnswer,
    UploadAnswerS3
} = require("./src/controllers");
const services = require("./src/services");
const cron = require('node-cron');
const express = require('express');
const serverless = require('serverless-http');
const app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

require("dotenv").config();

var task = cron.schedule('50 23 * * *', async() =>  {
  try {
    const result = await services.UploadAnswers();
    if (result.isSuccess) {
      console.log('Upload Success');
    } else {
      console.error('Upload Failed');
    } 
  } catch (error) {
    console.error('An error occurred while submit answer.', error);
  }
});

const port = process.env.PORT || 3001

app.get("/", (req, res) => { res.send(`Api is running.`) });
app.post("/login", Login);
app.get("/questions", GetQuestion);
app.post("/submit-answer", SubmitAnswer);
app.get("/uploadS3", UploadAnswerS3);

module.exports.handler = serverless(app);
/*
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
}).on('error', function (err) {
    if (err) {
        console.error(err);
        task.stop();
        process.exit(1);
    }
});
*/