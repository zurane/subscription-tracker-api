import express from "express";
import { PORT, JWT_SECRET, JWT_EXPIRES_IN } from "./config/env.js";
import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";
import subscriptionRouter from "./routes/subscription.route.js";
import connectDB from "./database/mongodb.js";
import errorMiddleware from "./middleware/error.middleware.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the susbscription tracker API application");
});


// Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);


app.use(errorMiddleware);
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded bodies like form submissions.
app.use(cookieParser()); // Parse Cookie header and populate req.cookies with an object keyed by the cookie names.


// Start the server
app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  await connectDB();
});

export default app;
