import { Router, IRouter } from 'express';
import { AuthCtrl } from '../controllers/auth';
import PromiseRouter from 'express-promise-router';

export const authRouter = (): IRouter => {
  const app = PromiseRouter();
  const authCtrl = new AuthCtrl();

  app.post('/login', async (req, res, next) => {
    const { username, password } = req.body;
    const { token, user } = await authCtrl.login(username, password);

    res.send({ token, user });
  });

  return app;
};
