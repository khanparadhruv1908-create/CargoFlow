import mongoose from 'mongoose';

const customsDeclarationSchema = new mongoose.Schema({
    declarationNumber: { 
        type: String, 
        unique: true,
        default: () => 'DEC-' + Math.floor(10000000 + Math.random() * 90000000)
    },
    port: { type: mongoose.Schema.Types.ObjectId, ref: 'CustomsPort', required: true },
    cargoValue: { type: Number, required: true },
    weight: { type: Number, required: true },
    description: { type: String, required: true },

    // Calculated fields
    clearanceCharges: { type: Number, required: true },
    dutyAmount: { type: Number, required: true },
    totalAmount: { type: Number, required: true },

    status: { type: String, enum: ['Pending', 'Processing', 'Cleared', 'Rejected'], default: 'Pending' },
    customer: { type: String } // Clerk ID
}, { timestamps: true });

customsDeclarationSchema.pre('save', async function () {
    if (!this.declarationNumber) {
        // Fallback
        this.declarationNumber = 'DEC-' + Math.floor(10000000 + Math.random() * 90000000);
    }
});

const CustomsDeclaration = mongoose.model('CustomsDeclaration', customsDeclarationSchema);
export default CustomsDeclaration;
