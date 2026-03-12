// const express = require("express");
// const router = express.Router();
// const User = require("../models/user.js");
// const wrapAsync = require("../utils/wrapAsync.js");
// const passport = require("passport");
// const { saveRedirectUrl } = require("../middleware.js");
// const userController = require("../controllers/user.js");
// const crypto = require("crypto");
// const transporter = require("../utils/email.js");
// require("dotenv").config(); // must be at the very top

// router
//   .route("/signup")
//   .get(userController.renderSignUpForm)
//   .post(wrapAsync(userController.signup));

// router
//   .route("/login")
//   .get(userController.renderLoginForm)
//   .post(
//     saveRedirectUrl,
//     passport.authenticate("local", {
//       failureRedirect: "/login",
//       failureFlash: true,
//     }),
//     userController.login,
//   );

// router.get("/logout", userController.logout);

// router.get(
//   "/verify-email/:token",
//   wrapAsync(async (req, res) => {
//     const user = await User.findOne({
//       verificationToken: req.params.token,
//       verificationTokenExpires: { $gt: Date.now() },
//     });

//     if (!user) {
//       req.flash("error", "Verification link is invalid or expired");
//       return res.redirect("/login");
//     }

//     user.isVerified = true;
//     user.verificationToken = undefined;
//     user.verificationTokenExpires = undefined;

//     await user.save();

//     req.flash(
//       "success",
//       "Email verified successfully. Please login.",
//     );
//     res.redirect("/login");
//   }),
// );

// // Render resend page
// router.get("/resend-verification", (req, res) => {
//   res.render("users/resend");
// });

// // Handle resend
// router.post(
//   "/resend-verification",
//   wrapAsync(async (req, res) => {
//     const { email } = req.body;

//     const user = await User.findOne({ email });

//     if (!user) {
//       req.flash("error", "No account found with this email.");
//       return res.redirect("/resend-verification");
//     }

//     if (user.isVerified) {
//       req.flash("success", "Email already verified. Please login.");
//       return res.redirect("/login");
//     }

//     // Generate new token
//     const token = crypto.randomBytes(32).toString("hex");

//     user.verificationToken = token;
//     user.verificationTokenExpires = Date.now() + 10 * 60 * 1000; // 10 mins
//     await user.save();
//     const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

//     const verifyURL = `${BASE_URL}/verify-email/${token}`;

//     await transporter.sendMail({
//       to: email,
//       subject: "Resend Email Verification - VoyageHomes",
//       html: `
//       <div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">

//   <h2 style="text-align: center; color: #2c3e50;">
//     Swargadhamam Community
//   </h2>

//   <p style="font-size: 15px; line-height: 1.6;">
//     Greetings,
//   </p>

//   <p style="font-size: 15px; line-height: 1.6;">
//     Thank you for being a part of <strong>Swargadhamam</strong> — a community dedicated to
//     developing and maintaining a sacred resting place, while transparently sharing ongoing
//     development activities, community contributions, testimonials, and donations.
//   </p>

//   <p style="font-size: 15px; line-height: 1.6;">
//     We noticed that your earlier email verification link has expired.
//     To complete your registration and access community updates, please verify your email address
//     by clicking the button below.
//   </p>

//   <div style="text-align: center; margin: 30px 0;">
//     <a
//       href="${verifyURL}"
//       style="
//         background-color: #2c3e50;
//         color: #ffffff;
//         padding: 12px 24px;
//         text-decoration: none;
//         font-size: 15px;
//         border-radius: 5px;
//         display: inline-block;
//       "
//     >
//       Verify Email Address
//     </a>
//   </div>

//   <p style="font-size: 14px; line-height: 1.6;">
//     This verification link is valid for a limited time for security reasons.
//     If you did not request this email, you may safely ignore it.
//   </p>

//   <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;" />

//   <p style="font-size: 13px; color: #777; line-height: 1.6;">
//     With regards,<br />
//     <strong>Swargadhamam Team</strong><br />
//     Building trust, transparency, and service for a sacred resting place.
//   </p>

// </div>

//     `,
//     });

//     req.flash(
//       "success",
//       "Verification email resent. Please check inbox.",
//     );
//     res.redirect("/login");
//   }),
// );

// module.exports = router;

const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");
const crypto = require("crypto");
const transporter = require("../utils/email.js");
require("dotenv").config();

router
  .route("/signup")
  .get(userController.renderSignUpForm)
  .post(wrapAsync(userController.signup));

router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login,
  );

router.get("/logout", userController.logout);

router.get(
  "/verify-email/:token",
  wrapAsync(async (req, res) => {
    const user = await User.findOne({
      verificationToken: req.params.token,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      req.flash("error", "Verification link is invalid or expired.");
      return res.redirect("/login");
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    req.flash(
      "success",
      "Email verified successfully. Please login.",
    );
    res.redirect("/login");
  }),
);

// Render resend page
router.get("/resend-verification", (req, res) => {
  res.render("users/resend");
});

// Handle resend
router.post(
  "/resend-verification",
  wrapAsync(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      req.flash("error", "No account found with this email.");
      return res.redirect("/resend-verification");
    }

    if (user.isVerified) {
      req.flash("success", "Email already verified. Please login.");
      return res.redirect("/login");
    }

    const token = crypto.randomBytes(32).toString("hex");
    user.verificationToken = token;
    user.verificationTokenExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
    const verifyURL = `${BASE_URL}/verify-email/${token}`;

    // FIX 1: Respond first, email in background (same fix as signup)
    req.flash(
      "success",
      "Verification email resent. Please check your inbox.",
    );
    res.redirect("/login");

    // FIX 2: Unique subject with timestamp to prevent email threading
    const timestamp = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
    });

    transporter
      .sendMail({
        to: email,
        subject: `Resend Email Verification - Swargadhamam (${timestamp})`,
        html: `
          <div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <h2 style="text-align: center; color: #2c3e50;">Swargadhamam Community</h2>
            <p style="font-size: 15px; line-height: 1.6;">Greetings,</p>
            <p style="font-size: 15px; line-height: 1.6;">
              Your earlier email verification link has expired.
              Click the button below to get a new verification link.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verifyURL}"
                style="background-color: #2c3e50; color: #ffffff; padding: 12px 24px;
                  text-decoration: none; font-size: 15px; border-radius: 5px; display: inline-block;">
                Verify Email Address
              </a>
            </div>
            <p style="font-size: 14px; line-height: 1.6;">
              This link is valid for 10 minutes. If you did not request this, ignore this email.
            </p>
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;" />
            <p style="font-size: 13px; color: #777; line-height: 1.6;">
              With regards,<br />
              <strong>Swargadhamam Team</strong>
            </p>
          </div>
        `,
      })
      .catch((err) => {
        console.error(
          "Resend verification email failed:",
          err.message,
        );
      });
  }),
);

router.get(
  "/test-email",
  wrapAsync(async (req, res) => {
    await transporter.sendMail({
      from: `"Test" <${process.env.EMAIL}>`,
      to: process.env.EMAIL, // send to yourself
      subject: "Test email from Render " + Date.now(),
      html: "<p>Test email working!</p>",
    });
    res.send("Email sent! Check inbox.");
  }),
);

module.exports = router;
