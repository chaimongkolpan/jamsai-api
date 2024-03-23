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
  app.get('/download/:id', function(req, res){
    const file = `${__dirname}/public/Reward/Reward${req.params.id ?? 1}.webp`;
    res.download(file);
  });
};
async function router(fastify) {
    fastify.register(rootRoute);
}
module.exports = router;
  