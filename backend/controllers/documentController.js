import Document from '../models/Document.js';
import Shipment from '../models/Shipment.js';
import User from '../models/User.js';
import { createNotification } from './notificationController.js';
import path from 'path';
import fs from 'fs';

/**
 * @desc    Upload a new document
 */
export const uploadDocument = async (req, res) => {
    try {
        const { shipmentId, type, notes } = req.body;

        if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });
        if (!shipmentId || !type) {
            if (req.file) fs.unlinkSync(req.file.path);
            return res.status(400).json({ success: false, message: "ShipmentId and type are required" });
        }

        const document = await Document.create({
            shipmentId,
            type,
            fileUrl: `/uploads/documents/${req.file.filename}`,
            uploadedBy: req.user._id,
            status: 'Pending',
            notes
        });

        // NOTIFY ADMINS
        const shipment = await Shipment.findById(shipmentId);
        if (shipment) {
            const admins = await User.find({ role: 'admin' });
            for (const admin of admins) {
                createNotification({
                    userId: admin._id,
                    title: 'New Document Uploaded',
                    message: `New ${type} uploaded for ${shipment.shipmentId}.`,
                    type: 'document',
                    relatedId: shipment.shipmentId
                }, req.io).catch(() => {});
            }
        }

        res.status(201).json({ success: true, data: document });
    } catch (error) {
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Get documents for a shipment
 */
export const getShipmentDocuments = async (req, res) => {
    try {
        const documents = await Document.find({ shipmentId: req.params.shipmentId })
            .populate('uploadedBy', 'name email role')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: documents });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Verify or Reject a document
 */
export const verifyDocument = async (req, res) => {
    try {
        const { status, notes } = req.body;
        const document = await Document.findByIdAndUpdate(req.params.id, { status, notes }, { new: true });
        if (!document) return res.status(404).json({ success: false, message: "Document not found" });

        // NOTIFY OWNER
        const shipment = await Shipment.findById(document.shipmentId);
        if (shipment && shipment.customer) {
            createNotification({
                userId: shipment.customer,
                title: `Document ${status}`,
                message: `Your ${document.type} for ${shipment.shipmentId} has been ${status.toLowerCase()}.`,
                type: 'document',
                relatedId: shipment.shipmentId
            }, req.io).catch(() => {});
        }

        res.status(200).json({ success: true, data: document });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Delete a document
 */
export const deleteDocument = async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);
        if (!document) return res.status(404).json({ success: false, message: "Document not found" });

        if (document.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: "Not authorized" });
        }

        const filePath = path.join(process.cwd(), document.fileUrl);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

        await document.deleteOne();
        res.status(200).json({ success: true, message: "Document removed" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
