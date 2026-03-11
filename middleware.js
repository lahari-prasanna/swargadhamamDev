const Testimonial = require("./models/Testimonial");
const { gallerySchema } = require("./Schema.js");
const ExpressError = require("./utils/ExpressError.js");
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in to make changes");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

// module.exports.isOwnerOrAdmin = async (req, res, next) => {
//   let { id } = req.params;
//   let userReview = await Testimonial.findById(id);
//   const isOwner = userReview.owner.equals(req.user._id);
//   const isAdmin = req.user.role === "admin";

//   if (!isOwner && !isAdmin) {
//     req.flash("error", "You don't have permission to make changes!");
//     return res.redirect("/");
//   }
//   next();
// };

module.exports.isOwnerOrAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userReview = await Testimonial.findById(id);

    if (!userReview) {
      req.flash("error", "Testimonial not found");
      return res.redirect("/");
    }

    const isOwner = userReview.owner
      ? String(userReview.owner) === String(req.user._id)
      : false;

    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      req.flash(
        "error",
        "You don't have permission to make changes!",
      );
      return res.redirect("/");
    }

    next();
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong");
    res.redirect("/");
  }
};

module.exports.validateItem = (req, res, next) => {
  const { error } = gallerySchema.validate(req.body);

  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    req.flash("error", "You do not have permission to do that");
    return res.redirect("/gallery");
  }
  next();
};

module.exports.isVerified = (req, res, next) => {
  if (!req.user.isVerified) {
    req.flash("error", "Please verify your email first");
    return res.redirect("/");
  }
  next();
};
