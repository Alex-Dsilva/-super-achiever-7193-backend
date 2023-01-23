const express = require("express");
const { connection } = require("./config/db");
const { UserRouter } = require("./Routes/user.route");
const { OrderRouter} = require("./Routes/order.route")
const {
     ProductRouter,
     addBulkDataManually,
} = require("./Routes/product.route");
const { auth } = require("./middleware/auth");
require("dotenv").config();
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
     res.send("welcome");
});


app.use("/users",UserRouter)
app.use("/product",auth,ProductRouter)
app.use("/order",auth,OrderRouter)
app.listen(process.env.port, async () => {
     try {
          await connection;
          // await addBulkDataManually();
          console.log("connected to db");
     } catch (err) {
          console.log(err);
     }
     console.log(`working on ${process.env.port}`);
});
