import WarehouseLocation from '../models/WarehouseLocation.js';
import StorageBooking from '../models/StorageBooking.js';
import Invoice from '../models/Invoice.js';

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
        const { locationId, days, weight, cargoType, unitCount, startDate, paymentIntentId } = req.body;
        const location = await WarehouseLocation.findById(locationId);
        if (!location) return res.status(404).json({ message: 'Location not found' });

        const baseTotal = location.baseRatePerDay * days;
        const weightTotal = location.ratePerKgPerDay * weight * days;
        const totalCharges = baseTotal + weightTotal;

        const sDate = new Date(startDate);
        const eDate = new Date(startDate);
        eDate.setDate(eDate.getDate() + parseInt(days));

        const booking = await StorageBooking.create({
            location: locationId,
            cargoType: cargoType || 'Pallets',
            unitCount: unitCount || 1,
            days,
            weight,
            startDate: sDate,
            endDate: eDate,
            totalCharges,
            pricingBreakdown: {
                baseTotal,
                weightTotal,
                baseRateUsed: location.baseRatePerDay,
                weightRateUsed: location.ratePerKgPerDay
            },
            customer: req.user?.id
        });

        // Generate Automated Invoice
        await Invoice.create({
            customer: req.user.id,
            serviceType: 'Warehouse Storage',
            bookingId: booking.bookingNumber,
            amount: totalCharges,
            tax: totalCharges * 0.1,
            totalAmount: totalCharges * 1.1,
            status: 'Paid',
            paymentIntentId
        });

        // Update warehouse occupied units
        location.occupiedUnits += (unitCount || 1);
        await location.save();

        res.status(201).json(booking);
    } catch (error) { next(error); }
};

export const getStorageBookings = async (req, res, next) => {
    try {
        let query = {};
        if (req.user.role !== 'admin' && req.user.role !== 'manager') {
            query.customer = req.user.id;
        }

        const bookings = await StorageBooking.find(query)
            .populate('location')
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
