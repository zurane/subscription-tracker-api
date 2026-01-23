import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: 2,
      maxLength: 100,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be greater than 0"],
    },

    currency: {
      type: String,
      required: [true, "Currency is required"],
      enum: ["USD", "EUR", "GBP", "ZAR"],
      default: "ZAR",
    },

    subscriptionFrequency: {
      type: String,
      required: [true, "Subscription frequency is required"],
      enum: ["monthly", "yearly", "weekly", "daily"],
      default: "monthly",
    },

    category: {
      type: String,
      trim: true,
      maxLength: 50,
      enum: [
        "entertainment",
        "productivity",
        "education",
        "health",
        "finance",
        "lifestyle",
        "technology",
        "other",
      ],
    },

    paymentMethod: {
      type: String,
      trim: true,
    },

    status: {
      enum: ["active", "inactive", "canceled", "paused"],
      type: String,
      default: "active",
    },

    startDate: {
      type: Date,
      required: [true, "Start date is required"],
      validate: {
        validator: (value) => value <= new Date(),
        message: "Start date cannot be in the future",
      },
      default: Date.now,
    },

    renewalDate: {
      type: Date,
      validate: {
        validator: function (value) {
          return value > this.startDate;
        },
        message: "Renewal date must be after start date",
      },

      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },
    },
  },
  { timestamps: true },
);

// Auto-calculate renewalDate before validation if not provided.
subscriptionSchema.pre("validate", function (next) {
  if (!this.renewalDate) {
    const freqMap = {
      daily: 1,
      weekly: 7,
      monthly: 30,
      yearly: 365,
    };

    const renewalDate = new Date(this.startDate);
    renewalDate.setDate(
      renewalDate.getDate() + freqMap[this.subscriptionFrequency],
    );

    this.renewalDate = renewalDate;
  }

  if (this.renewalDate <= new Date()) {
    this.status = "inactive";
  }

  next();
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
