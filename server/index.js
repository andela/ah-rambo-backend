import express, { json, urlencoded } from 'express';
import logger from 'morgan';
import { config } from 'dotenv';

config();

const { log } = console;

const PORT = process.env.PORT || 9000;

const app = express();
app.use(logger('dev'));
app.use(json());
app.use(urlencoded({ extended: false, }));

app.get('/', (request, response) => {
  response.status(200).send('Welcome to Authors Haven ');
});

app.use('*', (request, response) => {
  response.status(404).send('Not Found');
});
app.listen(PORT, () => log(`Server started on port ${PORT}`));
export default app;
