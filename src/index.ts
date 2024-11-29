import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import { initializeDailyScheduler } from './cron/dailyScheduler';
import { retryPendingJobs } from './services/retryJobs';

dotenv.config();

const createApp = () => {
  const app = express();

  // Middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());

  // Routes
  app.use('/user', userRoutes);

  return app;
};

const startServer = (app: express.Application) => {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`listening on port http://localhost:${port}`);
    initializeDailyScheduler();
    retryPendingJobs();
  });
};

const app = createApp();
startServer(app);
