import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { authMiddleware } from "../controllers/auth_controller"; 
import dotenv from "dotenv";

const router = express.Router();
dotenv.config();

const base = process.env.DOMAIN_BASE;
const uploadDir = path.resolve(process.cwd(), 'uploads'); 

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const uniqueName = crypto.randomUUID() + ext;
        cb(null, uniqueName);
    }
});

const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

router.post("/", authMiddleware, (req, res) => {  
    upload.single("file")(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ error: "File upload error." });
        } else if (err) {
            return res.status(500).json({ error: "An unexpected error occurred during file upload." });
        }

        if (!req.file) {
            return res.status(400).json({ error: "Only images (jpeg, png, gif, webp) are allowed." });
        }

        const relativeFilePath = path.relative(uploadDir, req.file.path);
        const fileUrl = `${base}/uploads/${relativeFilePath.replace(/\\/g, "/")}`;

        console.log("Uploaded file URL:", fileUrl);
        res.status(200).json({ url: fileUrl });
    });
});

export = router;
