require("dotenv").config();
const express = require("express");
var path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");

const indexRouter = require("./routes/index");
const productsRouter = require("./routes/products");
const usersRouter = require("./routes/users");
const administrative_units_router = require("./routes/administrative_units");
const addressRouter = require("./routes/address");
const mediaRouter = require("./routes/media");
const colorRouter = require("./routes/color");
const sizeRouter = require("./routes/size");
const voucherRoutes = require('./routes/voucher');
const categoriesRouter = require("./routes/categories");
const cartsRouter = require("./routes/cart");
const shippingMethodRouter = require("./routes/shipping_methods");
const orderStatusRouter = require("./routes/order_status");
const orderRouter = require("./routes/order");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use(cors()); //cho phép các domain khác gọi tới api này

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => {
    console.error("MongoDB connection error: ", err);
    process.exit(1);
  });

// Routes
app.use("/", indexRouter);
app.use("/products", productsRouter);
app.use("/users", usersRouter);
app.use("/administrative_units", administrative_units_router);
app.use("/address", addressRouter);
app.use("/media", mediaRouter);
app.use("/colors", colorRouter);
app.use("/sizes", sizeRouter);
app.use("/categories", categoriesRouter);
app.use("/carts", cartsRouter);
app.use("/shipping_methods", shippingMethodRouter);
app.use("/order_status", orderStatusRouter);
app.use("/orders", orderRouter);
app.use('/voucher', voucherRoutes);


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start the server
const PORT = process.env.PORT || 2204;
app
  .listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  })
  .on("error", (err) => {
    console.error("Server failed to start:", err);
    process.exit(1);
  });

  mongoose.connect('mongodb://localhost:27017/DATN', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));