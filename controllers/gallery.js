const Gallery = require("../models/gallery.js");
const { cloudinary } = require("../cloudConfig");

module.exports.showGallery = async (req, res) => {
  const allPhotos = await Gallery.find({});
  res.render("./gallery/index.ejs", { allPhotos });
};

module.exports.AddNewGallery = async (req, res) => {
  let url = req.file.path;
  console.log(url);
  let filename = req.file.filename;
  const newListing = new Gallery(req.body.item);
  newListing.image = { url, filename };
  newListing.owner = req.user._id;
  await newListing.save();
  req.flash("success", "New work added Successfully");
  res.redirect("/gallery");
};

module.exports.renderNewForm = (req, res) => {
  res.render("gallery/new.ejs");
};

module.exports.showGalleryItem = async (req, res) => {
  let { id } = req.params;
  const item = await Gallery.findById(id).populate("owner");
  if (!item) {
    req.flash("error", "The Listing Does not Exist!");
    res.redirect("/gallery");
  } else {
    res.render("./gallery/show.ejs", { item });
  }
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const item = await Gallery.findById(id);
  if (!item) {
    req.flash("error", "The Listing Does not Exist!");
    res.redirect("/gallery");
  } else {
    res.render("gallery/edit.ejs", { item });
  }
};

module.exports.updateGalleryItem = async (req, res) => {
  let { id } = req.params;
  let tempItem = await Gallery.findByIdAndUpdate(id, {
    ...req.body.item,
  });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    console.log(url);
    let filename = req.file.filename;
    tempItem.image = { url, filename };
    await tempItem.save();
  }
  req.flash("success", "Work updated Successfully!");
  res.redirect(`/gallery/${id}`);
};

// module.exports.destroyGalleryItem = async (req, res) => {
//   let { id } = req.params;
//   await Gallery.findByIdAndDelete(id);
//   req.flash("success", "Work Deleted!");
//   res.redirect("/gallery");
// };

module.exports.destroyGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Find gallery item first
    const galleryItem = await Gallery.findById(id);

    if (!galleryItem) {
      req.flash("error", "Gallery item not found");
      return res.redirect("/gallery");
    }

    // 2️⃣ Delete image from Cloudinary (if not default image)
    if (
      galleryItem.image &&
      galleryItem.image.filename &&
      galleryItem.image.filename !== "listingimage"
    ) {
      console.log(
        "Deleting from Cloudinary:",
        galleryItem.image.filename,
      );

      try {
        await cloudinary.uploader.destroy(
          galleryItem.image.filename,
          { resource_type: "image" }, // gallery stores images
        );
      } catch (err) {
        console.error("Cloudinary deletion failed:", err);
      }
    }

    // 3️⃣ Delete from MongoDB
    await Gallery.findByIdAndDelete(id);

    req.flash("success", "Gallery Item Deleted!");
    res.redirect("/gallery");
  } catch (err) {
    console.error("Error in destroyGalleryItem:", err);
    req.flash("error", "Error deleting gallery item");
    res.redirect("/gallery");
  }
};
