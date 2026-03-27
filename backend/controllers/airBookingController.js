import AirBooking from '../models/AirBooking.js';
import Airline from '../models/Airline.js';
import Invoice from '../models/Invoice.js';

// @desc    Create a new AirBooking
// @route   POST /api/air-bookings
// @access  Private
export const createAirBooking = async (req, res, next) => {
    try {
        const { origin, destination, airlineId, weight, cargoType, shipmentDate, paymentIntentId } = req.body;

        if (!weight) return res.status(400).json({ message: 'Cargo weight is mandatory' });

        const airline = await Airline.findById(airlineId);
        if (!airline) return res.status(404).json({ message: 'Airline not found' });

        const totalCharges = weight * airline.pricePerKg;

        const booking = new AirBooking({
            origin,
            destination,
            airline: airlineId,
            weight,
            cargoType,
            shipmentDate,
            totalCharges,
            customer: req.user?.id
        });

        const createdBooking = await booking.save();

        // Generate Automated Invoice
        await Invoice.create({
            customer: req.user.id,
            serviceType: 'Air Freight',
            bookingId: createdBooking.awbNumber,
            amount: totalCharges,
            tax: totalCharges * 0.1, // 10% mock tax
            totalAmount: totalCharges * 1.1,
            status: 'Paid',
            paymentIntentId
        });

        // Populate airline details before returning to show name
        await createdBooking.populate('airline', 'name pricePerKg');

        res.status(201).json(createdBooking);
    } catch (error) {
        console.error("Air Booking Error:", error.message);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all bookings
// @route   GET /api/air-bookings
// @access  Private/Admin
export const getAirBookings = async (req, res, next) => {
    try {
        let query = {};
        // If not admin/manager, only show own bookings
        if (req.user.role !== 'admin' && req.user.role !== 'manager') {
            query.customer = req.user.id;
        }

        const bookings = await AirBooking.find(query)
            .populate('airline', 'name')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        next(error);
    }
};

// @desc    Track a booking by AWB number
// @route   GET /api/air-bookings/track/:awbNumber
// @access  Public
export const trackAirBooking = async (req, res, next) => {
    try {
        const booking = await AirBooking.findOne({ awbNumber: req.params.awbNumber }).populate('airline', 'name');
        if (booking) {
            res.json(booking);
        } else {
            res.status(404).json({ message: 'AWB Number not found' });
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Update booking status
// @route   PUT /api/air-bookings/:id/status
// @access  Private/Admin
export const updateBookingStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const booking = await AirBooking.findById(req.params.id);

        if (booking) {
            booking.status = status;
            const updatedBooking = await booking.save();
            res.json(updatedBooking);
        } else {
            res.status(404).json({ message: 'Booking not found' });
        }
    } catch (error) {
        next(error);
    }
};
