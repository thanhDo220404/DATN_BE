require("dotenv").config();
const express = require("express");
var path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");

const indexRouter = require("./routes/index");
const productsRouter = require("./routes/products");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use(cors()); //cho phép các domain khác gọi tới api này

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Routes
app.use("/", indexRouter);
app.use("/products", productsRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start the server
const PORT = process.env.PORT || 3000;
app
  .listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  })
  .on("error", (err) => {
    console.error("Server failed to start:", err);
    process.exit(1);
  });
