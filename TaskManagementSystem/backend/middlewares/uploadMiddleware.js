import multer from "multer";

// Configur storage for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Directory to save uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

// File filter 
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // Accept the file
    } 
    else {
        cb(new Error("Only .jpeg .jpg and .png formats are allowed"), false); // Reject the file
    }
};

const upload = multer({storage, fileFilter});

export default upload;