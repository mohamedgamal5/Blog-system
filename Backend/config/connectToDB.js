const mongoose = require("mongoose");
module.exports = async () => {
  await mongoose
    .connect(process.env.MONGO_URI, {})
    .then(() => console.log("Connect successfully to DB ^_^ ."))
    .catch((error) =>
      console.error("MongoDB connection failed:", error.message)
    );
  // await mongoose
  //   .connect("mongodb://localhost/blogDB", {})
  //   .then(() => console.log("MongoDB connection established ^_^."))
  //   .catch((error) =>
  //     console.error("MongoDB connection failed:", error.message)
  //   );
};
