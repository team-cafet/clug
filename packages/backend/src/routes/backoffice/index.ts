import express from 'express';
import { backofficeAuthRouter } from './auth';
import { backofficeOrganisationRouter } from './organisation';
import { backofficeUserRouter } from './user';

export default function (): express.Router {
  const app = express.Router();

  app.use('/backoffice', (() => {
    const backOfficeRoute = express.Router();
    backOfficeRoute.use('/auth', backofficeAuthRouter());
    backOfficeRoute.use('/organisations', backofficeOrganisationRouter());
    backOfficeRoute.use('/users', backofficeUserRouter());

    return backOfficeRoute;
  })());

  return app;
}
