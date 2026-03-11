const Testimonial = require("../models/Testimonial");
const { cloudinary } = require("../cloudConfig");

module.exports.renderEditForm = async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);
  res.render("edit-testimonial.ejs", { testimonial });
};

// module.exports.createTestimonial = async (req, res) => {
//   try {
//     console.log("Request reached controller");

//     const { role, review, stars } = req.body;
//     console.log(req.body);
//     const newListing = new Testimonial(req.body);
//     newListing.owner = req.user._id;
//     console.log(req.user._id);
//     console.log(newListing);
//     console.log("FILE:", req.file);
//     if (req.file) {
//       newListing.video = {
//         url: req.file.path,
//         filename: req.file.filename,
//       };
//       newListing.type = "video"; // VERY IMPORTANT
//     }

//     await newListing.save();
//     req.flash("success", "Testimonial added Successfully!");
//     res.redirect("/"); // testimonials page ki redirect
//   } catch (err) {
//     console.error(err);
//     res.send("Error saving testimonial");
//   }
// };

module.exports.createTestimonial = async (req, res) => {
  try {
    const { role, review, stars, username, userId } = req.body; // username for old testimonial, userId if existing user
    const newListing = new Testimonial(req.body);

    // ⭐ If admin, allow specifying owner or name
    if (req.user.role === "admin") {
      if (userId) {
        newListing.owner = userId; // link to existing user
      } else if (username) {
        newListing.owner = null; // no user object
        newListing.username = username; // store name manually
      }
    } else {
      // regular user
      newListing.owner = req.user._id;
    }

    // ⭐ Handle video upload
    if (req.file) {
      newListing.video = {
        url: req.file.path,
        filename: req.file.filename, // exact public_id
        resource_type: req.file.mimetype.startsWith("video")
          ? "video"
          : "image",
      };
      newListing.type = req.file.mimetype.startsWith("video")
        ? "video"
        : "image";
    }

    await newListing.save();
    req.flash("success", "Testimonial added Successfully!");
    res.redirect("/"); // or testimonials page
  } catch (err) {
    console.error(err);
    res.send("Error saving testimonial");
  }
};
module.exports.destroyTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(
      req.params.id,
    ).populate("owner", "username");

    if (!testimonial) {
      req.flash("error", "Testimonial not found");
      return res.redirect("/");
    }

    // Delete video/image from Cloudinary safely
    if (testimonial.video && testimonial.video.filename) {
      const resourceType = testimonial.video.resource_type || "video"; // fallback

      console.log(
        "Deleting from Cloudinary:",
        testimonial.video.filename,
        resourceType,
      );

      try {
        // Background deletion to avoid timeout blocking response
        cloudinary.uploader.destroy(
          testimonial.video.filename,
          { resource_type: resourceType },
          (err, result) => {
            if (err) console.error("Cloudinary delete error:", err);
            else console.log("Cloudinary delete result:", result);
          },
        );
      } catch (err) {
        console.error("Cloudinary deletion failed:", err);
      }
    }

    // Delete testimonial from MongoDB
    await Testimonial.findByIdAndDelete(req.params.id);

    req.flash("success", "Testimonial Deleted!");
    res.redirect("/");
  } catch (err) {
    console.error("Error in destroyTestimonial:", err);
    req.flash("error", "Error deleting testimonial");
    res.redirect("/");
  }
};

module.exports.updateTestimonial = async (req, res) => {
  const { role, review, stars } = req.body;

  await Testimonial.findByIdAndUpdate(req.params.id, {
    role,
    review,
    stars,
  });
  req.flash("success", "Updated Successfully!");
  res.redirect("/");
};
