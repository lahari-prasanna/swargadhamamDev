const User = require("../models/user");
const crypto = require("crypto");
const transporter = require("../utils/email");
require("dotenv").config(); // must be at the very top

module.exports.renderSignUpForm = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.login = (req, res) => {
  if (!req.user.isVerified) {
    req.flash("error", "Please verify your email before logging in");
    return res.redirect("/login");
  }
  req.flash("success", "Welcome back to Swargadhamam!");
  let redirectUrl = res.locals.redirectUrl || "/";
  res.redirect(redirectUrl);
};

module.exports.signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // 🔴 Block duplicate email EARLY
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.flash("error", "Email already registered. Please login.");
      return res.redirect("/signup");
    }

    const token = crypto.randomBytes(32).toString("hex");

    const newUser = new User({
      username,
      email,
      verificationToken: token,
      verificationTokenExpires: Date.now() + 10 * 60 * 1000,
      isVerified: false,
    });

    await User.register(newUser, password);

    const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
    const verifyURL = `${BASE_URL}/verify-email/${token}`;

    await transporter.sendMail({
      to: email,
      subject: "Verify your email - Swargadhamam",
      html: `
        <div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
  
  <h2 style="text-align: center; color: #2c3e50;">
    Welcome to Swargadhamam
  </h2>

  <p style="font-size: 15px; line-height: 1.6;">
    Greetings,
  </p>

  <p style="font-size: 15px; line-height: 1.6;">
    Thank you for registering with <strong>Swargadhamam</strong>.
    We are a community committed to developing and maintaining a sacred resting place,
    while openly sharing progress updates, community efforts, testimonials, and donation initiatives.
  </p>

  <p style="font-size: 15px; line-height: 1.6;">
    To complete your registration and access the community platform,
    please verify your email address by clicking the button below.
  </p>

  <div style="text-align: center; margin: 30px 0;">
    <a
      href="${verifyURL}"
      style="
        background-color: #2c3e50;
        color: #ffffff;
        padding: 12px 24px;
        text-decoration: none;
        font-size: 15px;
        border-radius: 5px;
        display: inline-block;
      "
    >
      Verify Email Address
    </a>
  </div>

  <p style="font-size: 14px; line-height: 1.6;">
    This verification link is valid for a limited time for security reasons.
    Please complete the verification at your earliest convenience.
  </p>

  <p style="font-size: 14px; line-height: 1.6;">
    If you did not create an account with Swargadhamam, you may safely ignore this email.
  </p>

  <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;" />

  <p style="font-size: 13px; color: #777; line-height: 1.6;">
    Warm regards,<br />
    <strong>Swargadhamam Team</strong><br />
    Serving with dignity, transparency, and care.
  </p>

</div>

      `,
    });

    req.flash(
      "success",
      "Verification email sent. Please check your inbox.",
    );
    res.redirect("/login");
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are Logged out successfully!");
    res.redirect("/");
  });
};
