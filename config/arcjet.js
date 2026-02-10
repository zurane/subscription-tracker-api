import arcjet, { shield, detectBot, tokenBucket } from "@arcjet/node";
import { ARCJET_KEY } from "./env.js";

const aj = arcjet({
    key: ARCJET_KEY,
    characteristics: ["ip.src"],
    rules: [
        // Shield protects your app from common attacks e.g. SQL injection
        shield({ mode: "LIVE" }),

        // Create a bot detection rule
        detectBot({
            mode: "LIVE",
            // OPTIONAL: Explicitly allow specific tools if you keep "AUTOMATED" blocked
            allow: ["CATEGORY:SEARCH_ENGINE", "POSTMAN"],
            // FIX: Removed "AUTOMATED" so Postman/cURL can access the API
            block: ["BAD_BOT"],
        }),

        // Create a token bucket rate limit.
        tokenBucket({
            mode: "LIVE",
            refillRate: 5, // Refill 5 tokens per interval
            interval: 10, // Refill every 10 seconds
            capacity: 10, // Bucket capacity of 10 tokens
        }),
    ],
});

export default aj;