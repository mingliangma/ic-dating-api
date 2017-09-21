import examplesRouter from './api/controllers/examples/router';
import accountRouter from './api/controllers/account/account.router';

export default function routes(app) {
  app.use('/api/v1/examples', examplesRouter);
  app.use('/api/v1/account', accountRouter);
}
