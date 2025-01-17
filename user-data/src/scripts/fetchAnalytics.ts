import 'dotenv/config';
import { GA4Client } from '../utils/GA4Client';

async function main() {
  try {
    if (!process.env.GOOGLE_CREDENTIALS) {
      throw new Error('GOOGLE_CREDENTIALS environment variable is not set');
    }

    const client = new GA4Client();
    await client.fetchAllMetrics();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main(); 