import express from "express";
import router from "./routes";

const app = express();

app.use(express.json());
app.use(router);

app.listen(8080, () => {
    console.log("Server is listening on 8080");
})