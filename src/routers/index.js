const {
    Login,
    GetQuestion,
    SubmitAnswer
} = require("../controllers");
const rootRoute = async (app) => {
  app.get("/", (req, res) => { res.send(`Api is running.`) });
  app.post("/login", Login);
  app.get("/questions", GetQuestion);
  app.post("/submit-answer", SubmitAnswer);
};
async function router(fastify) {
    fastify.register(rootRoute);
}
module.exports = router;
  