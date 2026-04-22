import mongoose from 'mongoose';

/**
 * Tracking Update Schema
 * Captures historical snapshots for the timeline UI
 */
const trackingSchema = new mongoose.Schema({
    // Reference to the shipmentId in Shipment model
    shipmentId: { 
        type: String, 
        required: true, 
        ref: 'Shipment' 
    },
    
    // Updated Status (e.g., "In Transit")
    status: { 
        type: String, 
        required: true 
    },
    
    // Physical location of the update (City/Port/Terminal)
    location: { 
        type: String, 
        required: true 
    },
    
    // GPS coordinates (optional - for map tracking)
    lat: { type: Number },
    lng: { type: Number },
    
    // Meta information
    timestamp: { 
        type: Date, 
        default: Date.now 
    },
    
    updatedBy: { 
        type: String, 
        default: 'System' 
    },
    
    // Additional info (e.g., "Flight EK505", "Vessel EVER GIVEN")
    details: { 
        type: String 
    }
}, { timestamps: true });

const Tracking = mongoose.model('Tracking', trackingSchema);
export default Tracking;
