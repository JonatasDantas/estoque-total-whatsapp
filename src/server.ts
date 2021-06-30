import express, { NextFunction, Request, Response } from "express";
import router from "./routes";
import "express-async-errors";
import dotenv from "dotenv";
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

import "./database";

const app = express();

app.use(express.json());
app.use(router);
app.use((err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof Error) {
        return response.status(400).json({
            error: err.message
        });
    }

    return response.status(500).json({
        status: "error",
        message: "Internal Server Error"
    });
})

app.listen(8080, () => {
    console.log("Server is listening on 8080");
})