const fastify = require("fastify")({ logger: true });
const cors = require("@fastify/cors");
const routes = require("./routers/index.js");

require("dotenv").config();

const corsConf = {
  origin: true,
};
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
        process.exit(1);
      }
      console.log(`Server is now listening on ${address}`);
    }
  );
})();