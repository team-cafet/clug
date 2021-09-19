import { AuthCtrl } from '../../controllers/backoffice/auth';
import { IRouter } from 'express';
import PromiseRouter from 'express-promise-router';

export const backofficeAuthRouter = (): IRouter => {
  const app = PromiseRouter();
  const authCtrl = new AuthCtrl();

  app.post('/login', async (req, res, next) => {
    const { username, password } = req.body;
    
    if(! username || ! password) {
      res.sendStatus(401);
    }

    const { token, user } = await authCtrl.login(username, password);

    res.send({ token, user });
  });

  return app;
};
