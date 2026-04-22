import Airline from '../models/Airline.js';

// @desc    Get all airlines
// @route   GET /api/airlines
// @access  Public
export const getAirlines = async (req, res, next) => {
    try {
        const airlines = await Airline.find({});
        res.json(airlines);
    } catch (error) {
        next(error);
    }
};

// @desc    Create an airline
// @route   POST /api/airlines
// @access  Private/Admin
export const createAirline = async (req, res, next) => {
    try {
        const { name, pricePerKg } = req.body;
        const airline = new Airline({
            name,
            pricePerKg,
        });
        const createdAirline = await airline.save();
        res.status(201).json(createdAirline);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Airline already exists' });
        }
        next(error);
    }
};

// @desc    Delete an airline
// @route   DELETE /api/airlines/:id
// @access  Private/Admin
export const deleteAirline = async (req, res, next) => {
    try {
        const airline = await Airline.findById(req.params.id);
        if (airline) {
            await airline.deleteOne();
            res.json({ message: 'Airline removed' });
        } else {
            res.status(404).json({ message: 'Airline not found' });
        }
    } catch (error) {
        next(error);
    }
};
