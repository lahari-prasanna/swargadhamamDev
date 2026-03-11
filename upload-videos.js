// upload-videos.js
require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const videosFolder = "./public/videos";
const folderName = "members";

async function uploadAll() {
  // Cloudinary లో already ఉన్న files తీసుకో
  const existing = await cloudinary.api.resources({
    resource_type: "video",
    type: "upload",
    prefix: folderName,
    max_results: 100,
  });

  // Already uploaded file names list
  const uploadedNames = existing.resources.map((r) =>
    path.basename(r.public_id),
  );
  console.log("✅ Already uploaded:", uploadedNames);

  const files = fs.readdirSync(videosFolder);

  for (const file of files) {
    const nameWithoutExt = path.parse(file).name;

    // Already ఉంటే skip చేయి
    if (uploadedNames.includes(nameWithoutExt)) {
      console.log(`⏭️  Skipping (already exists): ${file}`);
      continue;
    }

    const filePath = path.join(videosFolder, file);
    console.log(`⬆️  Uploading: ${file} ...`);

    try {
      const result = await cloudinary.uploader.upload(filePath, {
        resource_type: "video",
        folder: folderName,
        timeout: 120000,
      });
      console.log(`✅ ${nameWithoutExt} → ${result.secure_url}`);
    } catch (err) {
      console.error(
        `❌ Failed: ${file} → ${err.message || err.http_code}`,
      );
    }
  }

  console.log("\n🎉 All done!");
}

uploadAll();
