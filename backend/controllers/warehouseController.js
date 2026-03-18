import WarehouseLocation from '../models/WarehouseLocation.js';
import StorageBooking from '../models/StorageBooking.js';

// ---- LOCATION MANAGEMENT (ADMIN) ----
export const getWarehouseLocations = async (req, res, next) => {
    try {
        const locations = await WarehouseLocation.find({});
        res.json(locations);
    } catch (error) { next(error); }
};

export const createWarehouseLocation = async (req, res, next) => {
    try {
        const location = await WarehouseLocation.create(req.body);
        res.status(201).json(location);
    } catch (error) { next(error); }
};

export const deleteWarehouseLocation = async (req, res, next) => {
    try {
        await WarehouseLocation.findByIdAndDelete(req.params.id);
        res.json({ message: 'Location removed' });
    } catch (error) { next(error); }
};

// ---- STORAGE BOOKINGS ----
export const calculateStorage = async (req, res, next) => {
    try {
        const { locationId, days, weight } = req.body;
        const location = await WarehouseLocation.findById(locationId);
        
        if (!location) return res.status(404).json({ message: 'Warehouse location not found' });

        const charges = (location.baseRatePerDay * days) + (location.ratePerKgPerDay * weight * days);
        
        res.json({
            totalCharges: charges,
            breakdown: {
                baseRate: location.baseRatePerDay,
                weightRate: location.ratePerKgPerDay,
                days,
                weight
            }
        });
    } catch (error) { next(error); }
};

export const createStorageBooking = async (req, res, next) => {
    try {
        const { locationId, days, weight } = req.body;
        const location = await WarehouseLocation.findById(locationId);
        if (!location) return res.status(404).json({ message: 'Location not found' });

        const totalCharges = (location.baseRatePerDay * days) + (location.ratePerKgPerDay * weight * days);

        const booking = await StorageBooking.create({
            location: locationId,
            days,
            weight,
            totalCharges,
            customer: req.user?._id
        });

        res.status(201).json(booking);
    } catch (error) { next(error); }
};

export const getStorageBookings = async (req, res, next) => {
    try {
        const bookings = await StorageBooking.find({})
            .populate('location')
            .populate('customer', 'name email')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) { next(error); }
};

export const updateStorageStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const booking = await StorageBooking.findById(req.params.id);
        if (booking) {
            booking.status = status;
            await booking.save();
            res.json(booking);
        } else {
            res.status(404).json({ message: 'Booking not found' });
        }
    } catch (error) { next(error); }
};
