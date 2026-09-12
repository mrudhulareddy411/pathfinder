const mongoose = require("mongoose");
async function test() {
  try {
    await mongoose.connect("mongodb://mrudhula:Mrudhula946@ac-viexjmj-shard-00-00.k6lec1m.mongodb.net:27017,ac-viexjmj-shard-00-01.k6lec1m.mongodb.net:27017,ac-viexjmj-shard-00-02.k6lec1m.mongodb.net:27017/pathfinder?ssl=true&replicaSet=atlas-viexjmj-shard-0&authSource=admin&retryWrites=true&w=majority");
    console.log("SUCCESS");
    process.exit(0);
  } catch(e) {
    console.error("FAIL:", e.message);
    process.exit(1);
  }
}
test();
