import AirBooking from '../models/AirBooking.js';
import Airline from '../models/Airline.js';

// @desc    Create a new AirBooking
// @route   POST /api/air-bookings
// @access  Private
export const createAirBooking = async (req, res, next) => {
    try {
        const { origin, destination, airlineId, weight, cargoType, shipmentDate } = req.body;

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
            customer: req.user?._id
        });

        const createdBooking = await booking.save();

        // Populate airline details before returning to show name
        await createdBooking.populate('airline', 'name pricePerKg');

        res.status(201).json(createdBooking);
    } catch (error) {
        next(error);
    }
};

// @desc    Get all bookings
// @route   GET /api/air-bookings
// @access  Private/Admin
export const getAirBookings = async (req, res, next) => {
    try {
        const bookings = await AirBooking.find({}).populate('airline', 'name').populate('customer', 'name email').sort({ createdAt: -1 });
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
