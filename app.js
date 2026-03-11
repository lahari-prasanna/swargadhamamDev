if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const path = require("path");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError.js");
const Testimonial = require("./models/Testimonial.js");
const Donor = require("./models/Donor");

const session = require("express-session");
const { MongoStore } = require("connect-mongo");
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const Razorpay = require("razorpay");
const nodemailer = require("nodemailer");

const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");

/* ------------------ ROUTERS ------------------ */

const galleryRouter = require("./routers/gallery.js");
const testimonialsRouter = require("./routers/Testimonial.js");
const userRouter = require("./routers/user.js");

/* ------------------ EXPRESS SETUP ------------------ */

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

/* ------------------ SESSION STORE ------------------ */

const store = MongoStore.create({
  mongoUrl: process.env.MONGODBURI,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

const sessionOptions = {
  store: store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

/* ------------------ PASSPORT ------------------ */

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

/* ------------------ RAZORPAY ------------------ */

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

/* ------------------ EMAIL SETUP ------------------ */

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

/* ------------------ ROUTES ------------------ */

app.use("/gallery", galleryRouter);
app.use("/testimonials", testimonialsRouter);
app.use("/", userRouter);

/* ------------------ DATABASE ------------------ */

mongoose
  .connect(process.env.MONGODBURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

/* ------------------ PAGES ------------------ */

// Home
app.get("/", async (req, res) => {
  const testimonials = await Testimonial.find()
    .populate("owner")
    .sort({ createdAt: -1 });

  res.render("index.ejs", { testimonials });
});

// About
app.get("/about", (req, res) => {
  res.render("about.ejs");
});

// Impact
app.get("/impact", (req, res) => {
  res.render("impact.ejs");
});

// Donate page
app.get("/donate", async (req, res) => {
  const donors = await Donor.find().sort({ createdAt: -1 }).limit(20);
  res.render("donate.ejs", { donors });
});

// Contact
app.get("/contact", (req, res) => {
  res.render("contact.ejs");
});

app.post("/contact-message", async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  try {
    /* EMAIL TO ADMIN */

    await transporter.sendMail({
      from: process.env.EMAIL,

      to: "swargadhamamnandyal@gmail.com",

      subject: "New Contact Message - Swargadhamam",

      html: `

<h2>New Contact Message</h2>

<p><b>Name:</b> ${name}</p>

<p><b>Email:</b> ${email}</p>

<p><b>Phone:</b> ${phone}</p>

<p><b>Subject:</b> ${subject}</p>

<p><b>Message:</b></p>

<p>${message}</p>

`,
    });

    /* AUTO REPLY TO USER */

    await transporter.sendMail({
      from: process.env.EMAIL,

      to: email,

      subject: "Thank you for contacting Swargadhamam",

      html: `

<h2>Thank You for Contacting Swargadhamam</h2>

<p>Dear ${name},</p>

<p>We have received your message and our team will respond shortly.</p>

<p><b>Your Message:</b></p>

<p>${message}</p>

<br>

<p>With regards,</p>

<p><b>Swargadhamam Team</b></p>

<p>Nandyal, Andhra Pradesh</p>

`,
    });

    req.flash(
      "success",
      "Message sent successfully! We will contact you soon.",
    );

    res.redirect("/contact");
  } catch (err) {
    console.log(err);

    req.flash("error", "Something went wrong. Please try again.");

    res.redirect("/contact");
  }
});
// Privacy
app.get("/privacy-policy", (req, res) => {
  res.render("privacy.ejs");
});

// Terms
app.get("/terms-of-service", (req, res) => {
  res.render("terms.ejs");
});

/* ------------------ RAZORPAY ORDER ------------------ */

app.post("/create-order", async (req, res) => {
  const { amount } = req.body;

  try {
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: "donation_receipt",
    });

    res.json(order);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error creating order");
  }
});

/* ------------------ SEND CERTIFICATE + SAVE DONOR ------------------ */

app.post("/send-certificate", async (req, res) => {
  const { name, email, amount, paymentMethod } = req.body;

  if (paymentMethod === "qr") {
    return res.json({
      message: "QR payments do not receive certificate",
    });
  }

  try {
    /* Save donor */
    await Donor.create({
      name: name,
      amount: amount,
    });

    console.log("Donor saved:", name, amount);

    /* Load certificate template */
    const template = await loadImage(
      path.join(__dirname, "public/certificate/template.png"),
    );

    const canvas = createCanvas(template.width, template.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(template, 0, 0);

    /* LOAD SIGNATURE IMAGES */

    const presidentSign = await loadImage(
      path.join(__dirname, "public/signatures/president.png"),
    );

    const vicePresidentSign = await loadImage(
      path.join(__dirname, "public/signatures/vice-president.png"),
    );

    const secretarySign = await loadImage(
      path.join(__dirname, "public/signatures/secretary.png"),
    );

    /* DRAW SIGNATURES ON CERTIFICATE */

    ctx.drawImage(presidentSign, 220, 940, 200, 80);

    ctx.drawImage(
      vicePresidentSign,
      template.width / 2 - 100,
      940,
      200,
      80,
    );

    ctx.drawImage(secretarySign, template.width - 420, 940, 200, 80);

    const today = new Date().toLocaleDateString("en-IN");

    ctx.font = "bold 42px Arial";
    ctx.fillStyle = "#000";
    ctx.textAlign = "center";

    /* NAME POSITION */
    ctx.fillText(name, template.width / 2, 620);

    ctx.font = "30px Arial";
    ctx.fillText(
      "Donation Amount: ₹" + amount,
      template.width / 2,
      template.height / 2 + 100,
    );

    ctx.font = "30px Arial";
    ctx.textAlign = "left";

    /* DATE POSITION */
    ctx.fillText(today, template.width / 2 + 150, 820);

    const buffer = canvas.toBuffer("image/png");

    const certificatePath = path.join(
      __dirname,
      "public/certificate/generated.png",
    );

    fs.writeFileSync(certificatePath, buffer);

    /* Send email */
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Thank you for supporting Swargadhamam",
      html: `
      <h2>Certificate of Appreciation</h2>

      <p>Dear <b>${name}</b>,</p>

      <p>Thank you for donating <b>₹${amount}</b> to Swargadhamam.</p>

      <p>Your certificate is attached.</p>

      <p>Regards<br>Swargadhamam Team</p>
      `,
      attachments: [
        {
          filename: "certificate.png",
          path: certificatePath,
        },
      ],
    });

    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error sending certificate");
  }
});

/* ------------------ DONOR API ------------------ */

app.get("/api/donors", async (req, res) => {
  const donors = await Donor.find().sort({ createdAt: -1 }).limit(20);

  const total = await Donor.aggregate([
    {
      $group: {
        _id: null,
        totalAmount: { $sum: "$amount" },
      },
    },
  ]);

  res.json({
    donors,
    total: total.length ? total[0].totalAmount : 0,
  });
});

app.post("/contact-message", (req, res) => {
  console.log("Form submitted:", req.body);
  res.send("Form working!");
});
/* ------------------ ERROR HANDLING ------------------ */

app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("Error.ejs", { message });
});

/* ------------------ SERVER ------------------ */

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
