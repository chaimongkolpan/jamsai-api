const fastify = require("fastify")({ logger: true });
const cors = require("@fastify/cors");
const routes = require("./routers/index.js");
const cron = require('node-cron');
const services = require("./services");

require("dotenv").config();

const corsConf = {
  origin: true,
};

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

(async () => {
  fastify.register(cors, corsConf);
  fastify.register(require('@fastify/multipart'), {
    limits: {
      fileSize: 1024 * 1024 * 1024,
    },
  });
  fastify.register(require('@fastify/formbody'))
  fastify.register(routes);
  await fastify.ready();

  fastify.listen(
    {
      host: "0.0.0.0",
      port: process.env.PORT || 3001,
    },
    function (err, address) {
      if (err) {
        fastify.log.error(err);
        task.stop();
        process.exit(1);
      }
      console.log(`Server is now listening on ${address}`);
    }
  );
})();
