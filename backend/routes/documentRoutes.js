import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { 
    uploadDocument, 
    getShipmentDocuments, 
    verifyDocument, 
    deleteDocument 
} from '../controllers/documentController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// ---- MULTER CONFIGURATION ----
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = './uploads/documents';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Only images (JPG, PNG) and PDFs are allowed'));
    }
};

const upload = multer({ 
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// ---- ROUTES ----

// @route   POST /api/documents/upload
router.post('/upload', protect, upload.single('file'), uploadDocument);

// @route   GET /api/documents/:shipmentId
router.get('/:shipmentId', protect, getShipmentDocuments);

// @route   PUT /api/documents/:id/verify
router.put('/:id/verify', protect, authorize('admin', 'manager'), verifyDocument);

// @route   DELETE /api/documents/:id
router.delete('/:id', protect, deleteDocument);

export default router;
