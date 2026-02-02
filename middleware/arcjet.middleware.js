import aj from "../config/arcjet.js";

const arcjetMiddleware = async (req, res, next) => {
  if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
    return next();
  }

  try {
    // Arcjet expects (req, options)
    const conclusionResult = await aj.protect(req, { requested: 1 });
    if (conclusionResult && conclusionResult.isDenied && conclusionResult.isDenied()) {
      if (
        conclusionResult.reason &&
        conclusionResult.reason.isRateLimit &&
        conclusionResult.reason.isRateLimit()
      ) {
        return res.status(429).json({ error: "Too Many Requests" });
      } else if (
        conclusionResult.reason &&
        conclusionResult.reason.isBot &&
        conclusionResult.reason.isBot()
      ) {
        return res.status(403).json({ error: "Bot detected. No bots allowed" });
      } else {
        return res.status(403).json({ error: "Forbidden" });
      }
    }
    return next();
  } catch (error) {
    console.error("Arcjet middleware error:", error);
    return next(error);
  }
};

export default arcjetMiddleware;
