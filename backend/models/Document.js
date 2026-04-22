import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
    shipmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shipment',
        required: true
    },
    type: {
        type: String,
        enum: ['Invoice', 'Packing List', 'BL', 'AWB', 'ID Proof', 'Other'],
        required: true
    },
    fileUrl: {
        type: String,
        required: true
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Verified', 'Rejected'],
        default: 'Pending'
    },
    notes: {
        type: String
    }
}, { timestamps: true });

const Document = mongoose.model('Document', documentSchema);
export default Document;
