import bodyParser from 'body-parser';
import express from 'express';
import helmet from 'helmet';
import path from 'path';
import 'reflect-metadata';
import logger from './util/logger';
import { memberRouter } from './routes/member';
import { organisationRouter } from './routes/organisation';
import { clubRouter } from './routes/club';
import { staffRouter } from './routes/staff';
import { authRouter } from './routes/auth';
import ExpressJWT from 'express-jwt';
import { JWT_SECRET } from './config/auth';
import { apiErrorHandler } from './middlewares/api-error-handler';
import { paymentRouter } from './routes/payment';
import { paymentRequestRouter } from './routes/payment-request';
import { membershipRouter } from './routes/membership.route';
import { memberLabelRouter } from './routes/member-label';
import { membershipPlanRouter } from './routes/membership-plan.route';
import { dashboardRouter } from './routes/dashboard';

export const initApp = (): express.Express => {
  const app = express();

  app.set('port', process.env.PORT || 3000);

  app.use(helmet());

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use((req, res, next) => {
    logger.debug(
      JSON.stringify({
        method: req.method,
        url: req.url,
        params: req.params,
        body: req.body,
      })
    );
    next();
  });

  app.use(
    ExpressJWT({
      secret: JWT_SECRET,
      credentialsRequired: false,
      algorithms: ['HS256'],
      getToken: function fromHeaderOrQuerystring(req) {
        if (
          req.headers.authorization &&
          req.headers.authorization.split(' ')[0] === 'Bearer'
        ) {
          return req.headers.authorization.split(' ')[1];
        } else if (req.query && req.query.token) {
          return req.query.token;
        }
        return null;
      },
    })
  );

  // main api routes
  app.use('/api/members', memberRouter());
  app.use('/api/organisations', organisationRouter());
  app.use('/api/clubs', clubRouter());
  app.use('/api/staffs', staffRouter());
  app.use('/api/payments', paymentRouter());
  app.use('/api/payment-requests', paymentRequestRouter());
  app.use('/api/memberships', membershipRouter());
  app.use('/api/memberlabels', memberLabelRouter());
  app.use('/api/auth', authRouter());
  app.use('/api/membership-plans', membershipPlanRouter());
  app.use('/api/dashboard', dashboardRouter());

  // static
  app.use(
    express.static(path.join(process.cwd(), 'public'), { maxAge: 31557600000 })
  );
  app.get('/*', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
  });

  // 404
  app.use((req, res) => {
    res.status(404).send("Sorry can't find that!");
  });

  // Error handler
  app.use('/api', apiErrorHandler);

  return app;
};
