import aj from "../config/arcjet.js";

const arcjetMiddleware = async (req, res, next) => {
  try {
    const conclusionResult = await aj.protect(req, { requested: 1 });
    if (conclusionResult.isDenied()) {
      if (conclusionResult.reason.isRateLimit()) {
        return res.status(429).json({ error: "Too Many Requests" });
      } else if (conclusionResult.reason.isBot()) {
        return res.status(403).json({ error: "Bot detected. No bots allowed" });
      } else {
        return res.status(403).json({ error: "Forbidden" });
      }
    }
    next();
  } catch (error) {
    console.error("Arcjet middleware error:", error);
    res.status(500).json({ message: "Internal server error." });
    next(error);
  }
};

export default arcjetMiddleware;
