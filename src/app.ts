import express, { Request, Response } from "express";
import apiRoutes from "../src/routes";

const app = express();

//body parser middleware
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use("/", apiRoutes);

app.use((request: Request, response: Response): void => {
  response.status(404).json({
    status: "error",
    message: `Cannot ${request.method} ${request.path}`
  });
});

export default app;
