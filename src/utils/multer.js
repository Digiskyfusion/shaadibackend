const multer = require('multer');
const path = require('path');

// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');  // Directory to store images
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); // Unique filename
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Ensure file extension is preserved
    }
});

// File filter to accept only image files
// const fileFilter = (req, file, cb) => {
//     const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg']; // Allowed file types
//     if (allowedMimeTypes.includes(file.mimetype)) {
//         cb(null, true); // Accept the file
//     } else {
//         cb(new Error('Only .jpeg, .jpg, .png files are allowed!'), false); // Reject the file
//     }
// };

// Initialize multer with the configuration
const upload = multer({
    storage: storage,
    // fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // Limit file size to 5MB
    }
});

module.exports = upload;
