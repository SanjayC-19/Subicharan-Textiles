import Razorpay from 'razorpay';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// Always load from the server/.env file
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_SVtxwS1gIf2WRT',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'b7kqzd9sDLMt3MO18GIOE1ZJ',
});

export default razorpay;
