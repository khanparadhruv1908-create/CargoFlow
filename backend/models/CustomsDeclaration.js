import mongoose from 'mongoose';

const customsDeclarationSchema = new mongoose.Schema({
    declarationNumber: { type: String, unique: true },
    port: { type: mongoose.Schema.Types.ObjectId, ref: 'CustomsPort', required: true },
    cargoValue: { type: Number, required: true },
    weight: { type: Number, required: true },
    description: { type: String, required: true },

    // Calculated fields
    clearanceCharges: { type: Number, required: true },
    dutyAmount: { type: Number, required: true },
    totalAmount: { type: Number, required: true },

    status: { type: String, enum: ['Pending', 'Processing', 'Cleared', 'Rejected'], default: 'Pending' },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

customsDeclarationSchema.pre('save', function (next) {
    if (!this.declarationNumber) {
        this.declarationNumber = 'DEC-' + Math.floor(10000000 + Math.random() * 90000000);
    }
    next();
});

const CustomsDeclaration = mongoose.model('CustomsDeclaration', customsDeclarationSchema);
export default CustomsDeclaration;
