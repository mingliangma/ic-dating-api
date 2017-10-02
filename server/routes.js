import accountRouter from './api/controllers/account/account.router';
import signRouter from './api/controllers/sign/sign.router';
import discoveryRouter from './api/controllers/discovery/discovery.router';

export default function routes(app) {
  app.use('/api/v1/account', accountRouter);
  app.use('/api/v1/sign', signRouter);
  app.use('/api/v1/discovery', discoveryRouter);
}
