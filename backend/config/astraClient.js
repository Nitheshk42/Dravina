const { DataAPIClient } = require('@datastax/astra-db-ts');

const client = new DataAPIClient(process.env.ASTRA_DB_APPLICATION_TOKEN);

const db = client.db(process.env.ASTRA_DB_API_ENDPOINT);

const connectAstra = async () => {
  try {
    await db.listCollections();
    console.log('✅ Astra DB connected successfully');
  } catch (error) {
    console.error('❌ Astra DB connection failed:', error);
    throw error;
  }
};

module.exports = { db, connectAstra };