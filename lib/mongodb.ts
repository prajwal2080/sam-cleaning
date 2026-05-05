import { MongoClient, type Db } from "mongodb";

function getMongoConfig() {
  const mongodbUri = process.env.MONGODB_URI;
  const mongodbDbName = process.env.MONGODB_DB;

  if (!mongodbUri) {
    throw new Error("Missing env var: MONGODB_URI");
  }

  if (!mongodbDbName) {
    throw new Error("Missing env var: MONGODB_DB");
  }

  return { mongodbUri, mongodbDbName };
}

type GlobalMongo = {
  __mongoClient?: MongoClient;
  __mongoClientPromise?: Promise<MongoClient>;
  __mongoDb?: Db;
  __mongoIndexesPromise?: Promise<void>;
};

const globalForMongo = globalThis as unknown as GlobalMongo;

function getClientPromise() {
  if (globalForMongo.__mongoClientPromise) {
    return globalForMongo.__mongoClientPromise;
  }

  const { mongodbUri } = getMongoConfig();

  const client = new MongoClient(mongodbUri);
  globalForMongo.__mongoClient = client;
  globalForMongo.__mongoClientPromise = client.connect();
  return globalForMongo.__mongoClientPromise;
}

export async function getDb() {
  if (globalForMongo.__mongoDb) {
    return globalForMongo.__mongoDb;
  }

  const client = await getClientPromise();
  const { mongodbDbName } = getMongoConfig();
  const db = client.db(mongodbDbName);
  globalForMongo.__mongoDb = db;
  return db;
}

export async function ensureBookingIndexes() {
  if (globalForMongo.__mongoIndexesPromise) {
    return globalForMongo.__mongoIndexesPromise;
  }

  globalForMongo.__mongoIndexesPromise = (async () => {
    const db = await getDb();
    await db.collection("bookings").createIndex(
      { serviceDateYmd: 1 },
      { unique: true, name: "uniq_serviceDateYmd" }
    );
  })();

  return globalForMongo.__mongoIndexesPromise;
}
