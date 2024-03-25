const {
    Login,
    GetQuestion,
    SubmitAnswer,
    UploadAnswerS3
} = require("../controllers");
const rootRoute = async (app) => {
  app.get("/", (req, res) => { res.send(`Api is running.`) });
  app.post("/login", Login);
  app.get("/questions", GetQuestion);
  app.post("/submit-answer", SubmitAnswer);
  app.get("/uploadS3", UploadAnswerS3);
};
async function router(fastify) {
    fastify.register(rootRoute);
}
module.exports = router;
  