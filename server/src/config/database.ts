import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config();

const sslCertPath = process.env.SSL_CERT_PATH as string;
const sslCert = fs.readFileSync(sslCertPath).toString();


const encodedCert = encodeURIComponent(sslCert);


const databaseUrl = `${process.env.DATABASE_URL}?sslmode=verify-full&sslcert=${encodedCert}`;

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
});

export default prisma;