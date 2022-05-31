import express, { Request, Response, NextFunction } from "express";

const app = express();

//body parser middleware
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(express.static("public"));

app.use((request: Request, response: Response, next: NextFunction) => {
    return response.status(404).json({
    status: "error",
    message: `Cannot ${request.method} ${request.path}`
  });
});

export default app;