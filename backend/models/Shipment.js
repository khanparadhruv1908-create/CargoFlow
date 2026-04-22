import mongoose from 'mongoose';

/**
 * Modern Shipment Schema with Stakeholders
 * Includes Shipper (Sender), Consignee (Receiver), and Handled By (Internal Admin)
 */
const shipmentSchema = new mongoose.Schema({
    shipmentId: { 
        type: String, 
        required: true, 
        unique: true,
        default: () => 'CF-' + Math.random().toString(36).substr(2, 9).toUpperCase()
    },
    
    // Shipper Details (Sender - મોકલનાર)
    shipper: {
        name: { type: String, required: [true, 'Shipper name is required'] },
        company: { type: String },
        phone: { 
            type: String, 
            required: [true, 'Shipper phone is required'],
            match: [/^\+?[1-9]\d{1,14}$/, 'Please provide a valid phone number']
        },
        email: { 
            type: String, 
            match: [/\S+@\S+\.\S+/, 'Please provide a valid email']
        },
        address: { type: String, required: [true, 'Shipper address is required'] }
    },
    
    // Consignee Details (Receiver - મેળવનાર)
    consignee: {
        name: { type: String, required: [true, 'Consignee name is required'] },
        company: { type: String },
        phone: { 
            type: String, 
            required: [true, 'Consignee phone is required'],
            match: [/^\+?[1-9]\d{1,14}$/, 'Please provide a valid phone number']
        },
        email: { 
            type: String, 
            match: [/\S+@\S+\.\S+/, 'Please provide a valid email']
        },
        address: { type: String, required: [true, 'Consignee address is required'] }
    },

    // Internal Stakeholder
    handledBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    cargoType: { type: String, required: true },
    weight: { type: Number, required: true }, 
    
    status: {
        type: String,
        enum: [
            'Booking Confirmed', 
            'Assigned to Handler',
            'Picked Up', 
            'In Transit', 
            'Arrived', 
            'Out for Delivery', 
            'Delivered', 
            'Delayed', 
            'Cancelled'
        ],
        default: 'Booking Confirmed'
    },
    
    eta: { type: Date },
    customer: { type: String }, // User/Client ID who booked it
    
}, { timestamps: true });

// Pre-save hook to ensure shipmentId is always generated
shipmentSchema.pre('save', function (next) {
    if (!this.shipmentId) {
        this.shipmentId = 'CF-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }
    next();
});

const Shipment = mongoose.model('Shipment', shipmentSchema);
export default Shipment;
