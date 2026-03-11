// WARNING: This script clears the database and inserts test data.
// Only run in development, never in production.

const mongoose = require("mongoose");
const initData = require("./data.js");
const Gallery = require("../models/gallery.js");

let MONGO_URL = "mongodb://127.0.0.1:27017/swargadhamam";

main()
  .then(() => {
    console.log("connection successful");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Gallery.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "6985bfd10b1e426b024aa1ff",
  }));

  await Gallery.insertMany(initData.data);
  console.log("Data was initialized");
};
initDB();
