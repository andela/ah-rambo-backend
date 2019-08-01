import express, { json, urlencoded } from 'express';
import logger from 'morgan';
import { config } from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import Debug from 'debug';
import routes from './routes';

const PORT = process.env.PORT || 9000;

config();

const debug = Debug('dev');

const app = express();
const swaggerDoc = YAML.load(
  path.join(__dirname, './docs/authors-haven-api.yml')
);

app.use(logger('dev'));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.get('/', (request, response) => {
  response.status(200).send('Welcome to Authors Haven ');
});

app.use('/api/v1', routes);

app.use('*', (request, response) => {
  response.status(404).send('Not Found');
});

app.listen(PORT, () => debug(`Server started on port ${PORT}`));

export default app;
