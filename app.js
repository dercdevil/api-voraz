const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const multer  = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();
const app = express();

const auth = require('./routes/auth');
const carrierAddresses = require('./routes/carrier-addresses');
const carriers = require('./routes/carriers');
const categories = require('./routes/categories');
const coupons = require('./routes/coupons');
const inventories = require('./routes/inventories');
const orderProducts = require('./routes/oderProducts');
const orders = require('./routes/orders');
const productCategories = require('./routes/product-categories');
const productGallery = require('./routes/product-gallery');
const products = require('./routes/products');
const profile = require('./routes/profile');
const userAddress = require('./routes/user-addresses');
const users = require('./routes/users');
const channels = require('./routes/channels');
const utils = require('./routes/utils-request');

// Settings
app.set("port", process.env.PORT || 4000);
app.set("json spaces", 4);
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/uploads'),
    filename: (req, file, cb) => {
        cb(null, uuidv4() + path.extname(file.originalname));
    }
});

app.use(multer({
  storage,
  dest: path.join(__dirname,'public/uploads'),
  fileFilter: (req,file,cb) =>{
    var filetypes = /jpeg|jpg|png|gif/;
    var mimetype = filetypes.test(file.mimetype);  
    if (mimetype) {
      return cb(null, true);
    }
    cb("Error: File upload only supports the following filetypes - " + filetypes);
  }
}).single("image"))


app.use(cors({}));
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json({limit:'5mb'}));
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public/uploads')));
app.use(express.static(path.join(__dirname, 'public/assets')));

// Welcome Routes
app.get("/", (req, res) => {
  res.json({
    message: "ok"
  });
});
app.use(auth);
app.use(carrierAddresses);
app.use(carriers);
app.use(categories);
app.use(coupons);
app.use(inventories);
app.use(orderProducts);
app.use(orders);
app.use(productCategories);
app.use(productGallery);
app.use(products);
app.use(profile);
app.use(userAddress);
app.use(users);
app.use(channels);
app.use(utils);

module.exports = app;