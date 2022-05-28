import express from 'express';
import * as trpc from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
import cors from 'cors';
import {z} from 'zod';

interface ChatMessage {
  user: string
  message: string
}

const messages: ChatMessage[] = [
  { user: 'user1', message: 'Hello' },
  { user: 'user2', message: 'Hi' },
];


const appRouter = trpc.router()
  .query('hello', {
    resolve() {
      return 'Hello world :) ok nice SUP ? huh ok';
    }
  })
  .query('getMessages',{
    input: z.number().default(10),
    resolve({input}) {
      return messages.slice(-input);
    }
  })
  .mutation('addMessage',{
    input: z.object({
      user: z.string(),
      message: z.string()
    })
    , resolve({input}) {
      messages.push(input);
      return input;
    }});
// subscription route for websockets

export type AppRouter = typeof appRouter;

const app = express();
app.use(cors());
const port = 8080;

app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: () => null, // context used with authorizaion from the headers and pass it to the routers with user information et
  })
);

app.get('/', (req, res) => {
  res.send('Hello from api-server');
});

app.listen(port, () => {
  console.log(`api-server listening at http://localhost:${port}`);
});
console.log('ok');