import express from "express";
import { connectDatabase } from "./config/database";
import userRoutes from "./routes/user.routes";

const app = express();

app.use(express.json());
app.use("/api/users", userRoutes);

app.use((error: any, req: any, res: any, next: any) => {
  res.status(error.status || 500).json({ message: error.message });
});

export default app;