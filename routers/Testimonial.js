const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const multer = require("multer");
const { testimonialStorage } = require("../cloudConfig");
const upload = multer({ storage: testimonialStorage });

const {
  isLoggedIn,
  isOwnerOrAdmin,
  isVerified,
} = require("../middleware.js");
const Testimonial = require("../models/Testimonial.js");
const testimonialController = require("../controllers/testimonial.js");
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwnerOrAdmin,
  isVerified,
  wrapAsync(testimonialController.renderEditForm),
);

router.post(
  "/",
  isLoggedIn,
  isVerified,
  upload.single("video"),
  (req, res, next) => {
    console.log("MULTER FILE:", req.file);
    console.log("MULTER BODY:", req.body);
    next();
  },
  wrapAsync(testimonialController.createTestimonial),
);

router
  .route("/:id")
  .delete(
    isLoggedIn,
    isOwnerOrAdmin,
    isVerified,
    testimonialController.destroyTestimonial,
  )
  .put(
    isLoggedIn,
    isOwnerOrAdmin,
    isVerified,
    testimonialController.updateTestimonial,
  );

module.exports = router;
