import { config } from 'dotenv';
import app from './index';

config();

const { log } = console;

const PORT = process.env.PORT || 9000;

app.listen(PORT, () => log(`Server started on port ${PORT}`));
