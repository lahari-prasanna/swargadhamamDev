const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const Gallery = require("../models/gallery.js");
const galleryController = require("../controllers/gallery.js");

const {
  isLoggedIn,
  validateItem,
  isVerified,
  isAdmin,
} = require("../middleware.js");

const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router.route("/").get(wrapAsync(galleryController.showGallery)).post(
  isLoggedIn,
  isAdmin,
  validateItem,
  upload.single("item[image]"),

  wrapAsync(galleryController.AddNewGallery),
);

//new route
router.get(
  "/new",
  isLoggedIn,
  isAdmin,
  isVerified,
  galleryController.renderNewForm,
);

router
  .route("/:id")
  .get(wrapAsync(galleryController.showGalleryItem))
  .put(
    isLoggedIn,
    isAdmin,
    validateItem,
    isVerified,
    upload.single("item[image]"),
    wrapAsync(galleryController.updateGalleryItem),
  )
  .delete(
    isLoggedIn,
    isAdmin,
    isVerified,
    wrapAsync(galleryController.destroyGalleryItem),
  );

//edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isAdmin,
  isVerified,
  wrapAsync(galleryController.renderEditForm),
);

module.exports = router;
