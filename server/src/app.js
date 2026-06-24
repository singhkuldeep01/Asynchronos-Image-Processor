import express from 'express';
const app = express();
import apiRoutes from './apis/index.js';
import path from 'path';
import cors from 'cors';
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(
  "/api/v1/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);

app.use(
  "/api/v1/processed",
  express.static(path.join(process.cwd(), "processed"))
);

console.log(process.cwd());
console.log(path.join(process.cwd(), "uploads"));

app.use('/api', apiRoutes);


export default app;