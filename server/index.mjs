import express from "express";
import cors from "cors";
import product from "./routes/product.js";
import "./loadEnvironment.mjs"

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/product", product);

app.use((err, _req, res, next) => {
    res.status(500).send("Uh oh! An unexpected error occured.")
})

// start the Express server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
