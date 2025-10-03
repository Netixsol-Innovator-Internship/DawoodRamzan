const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
// require("dotenv").config();  // ✅ load env file


let mongo;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
    process.env.JWT_SECRET=process.env.JWT_SECRET || "Daud";

  await mongoose.connect(uri, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  });
});

afterEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.close();
  if (mongo) await mongo.stop();
});
