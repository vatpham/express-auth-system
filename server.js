require("dotenv").config();
const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api", userRoutes);

app.listen(3000, () => {
    console.log(`Server running on port ${process.env.PORT}`);
})


