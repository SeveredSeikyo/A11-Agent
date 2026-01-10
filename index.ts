import dotenv from "dotenv";
import { Elysia } from "elysia";
import { cors } from '@elysiajs/cors';
import { ip } from "elysia-ip";
import { agentRouter } from "./src/routes/agent.route";

dotenv.config();

const app = new Elysia()
    .use(ip())
    .use(cors())
    .use(agentRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, (server) => {
    console.log(`🚀 Server listening on ${server.hostname}:${server.port}`);
});
