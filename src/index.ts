import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/userRoutes';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.use('/user', userRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on port http://localhost:${port}`);
});
