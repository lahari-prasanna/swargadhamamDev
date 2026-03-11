const mongoose = require("mongoose");
const schema = mongoose.Schema;

const testimonialSchema = new schema({
  owner: {
    type: schema.Types.ObjectId,
    ref: "User",
  },
  username: { type: String },
  role: {
    type: String,
    required: true,
  },
  review: {
    type: String,
    required: true,
  },
  stars: {
    type: Number,
    default: 5,
  },
  // ⭐ NEW: testimonial type
  type: {
    type: String,
    enum: ["text", "video"],
    default: "text",
  },

  // ⭐ NEW: video testimonial (optional)
  video: {
    filename: String,
    url: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Testimonial", testimonialSchema);
