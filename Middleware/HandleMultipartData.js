import multer from "multer";

// Define storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(file);
    return cb(null, "./uploads"); // Destination folder for uploaded files
  },
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}"-"${file.originalname}`); // Rename the file to include the timestamp
  },
});
