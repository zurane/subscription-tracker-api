import express from "express";
import { PORT } from "./config/env.js";
import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";
import subscriptionRouter from "./routes/subscription.route.js";
import connectDB from "./database/mongodb.js";
import errorMiddleware from "./middleware/error.middleware.js";
import cookieParser from "cookie-parser";
import arcjetMiddleware from "./middleware/arcjet.middleware.js";
import workflowRouter from "./routes/workflow.routes.js";
import cors from "cors";

const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
})); // Enable CORS for all routes (you can configure it further as needed)

app.use(express.json());
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded bodies like form submissions.
app.use(cookieParser()); // Parse Cookie header and populate req.cookies with an object keyed by the cookie names.
app.use(arcjetMiddleware); // Apply Arcjet protection to all routes

app.get("/", (req, res) => { // for testing
  res.send("Welcome to the susbscription tracker API application");
});

// Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use('/api/v1/workflows', workflowRouter)

app.use(errorMiddleware);

// Start the server
app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  await connectDB();
});

export default app;
