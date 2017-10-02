import dotenv from 'dotenv';

if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: '.env.test' });
  dotenv.config();
} else {
  dotenv.config();
}

