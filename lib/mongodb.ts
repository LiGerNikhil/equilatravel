import mongoose from 'mongoose';
import { promises as dnsPromises, setServers, getServers } from 'dns';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

const cached = globalThis.mongoose || { conn: null, promise: null };
if (!globalThis.mongoose) {
  globalThis.mongoose = cached;
}

async function resolveSrvWithFallback(hostname: string): Promise<{ name: string; port: number }[]> {
  const srvName = `_mongodb._tcp.${hostname}`;
  try {
    return await dnsPromises.resolveSrv(srvName);
  } catch {
    const saved = getServers();
    setServers(['8.8.8.8', '8.8.4.4']);
    try {
      return await dnsPromises.resolveSrv(srvName);
    } finally {
      setServers(saved);
    }
  }
}

function parseSrvUri(uri: string): { creds: string; host: string; dbAndQuery: string } | null {
  const m = uri.match(/^mongodb\+srv:\/\/([^@]+@)([^/?]+)(\/.*)?$/);
  if (!m) return null;
  return { creds: m[1], host: m[2], dbAndQuery: m[3] || '/' };
}

let retried = false;

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const uri = MONGODB_URI || '';
    cached.promise = mongoose
      .connect(uri)
      .then((mi) => {
        console.log('MongoDB connected successfully');
        return mi;
      })
      .catch(async (error: any) => {
        if (retried || !uri.startsWith('mongodb+srv://')) throw error;
        retried = true;
        const parsed = parseSrvUri(uri);
        if (!parsed) throw error;

        console.log('SRV DNS lookup failed, attempting alternative resolution...');

        try {
          const records = await resolveSrvWithFallback(parsed.host);
          const seedList = records.map((r) => `${r.name}:${r.port}`).join(',');

          let rest = parsed.dbAndQuery;
          const hasQuery = rest.includes('?');
          if (!rest.includes('ssl=')) rest += `${hasQuery ? '&' : '?'}ssl=true`;
          if (!rest.includes('authSource=')) rest += '&authSource=admin';
          if (!rest.includes('retryWrites=')) rest += '&retryWrites=true';
          if (!rest.includes('w=')) rest += '&w=majority';

          const newUri = `mongodb://${parsed.creds}${seedList}${rest}`;
          console.log('Retrying with resolved SRV seed list');
          return mongoose.connect(newUri).then((mi) => {
            console.log('MongoDB connected via SRV-resolved URI');
            return mi;
          });
        } catch (srvErr) {
          console.log('SRV resolution also failed, trying direct connection fallback...');
          const fallbackUri = `mongodb://${parsed.creds}${parsed.host}:27017${parsed.dbAndQuery}`;
          const fb = new URL(fallbackUri);
          if (!fb.searchParams.has('ssl')) fb.searchParams.set('ssl', 'true');
          if (!fb.searchParams.has('authSource')) fb.searchParams.set('authSource', 'admin');
          if (!fb.searchParams.has('directConnection')) fb.searchParams.set('directConnection', 'true');
          return mongoose.connect(fb.toString()).then((mi) => {
            console.log('MongoDB connected via direct fallback');
            return mi;
          });
        }
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
