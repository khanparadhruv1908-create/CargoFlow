import { ContainerType, VesselSchedule, OceanBooking } from '../models/Ocean.js';
import Invoice from '../models/Invoice.js';

// ---- COINTAINER TYPES ----
export const getContainerTypes = async (req, res, next) => {
    try {
        const types = await ContainerType.find({});
        res.json(types);
    } catch (error) { next(error); }
};

export const createContainerType = async (req, res, next) => {
    try {
        const { name, price } = req.body;
        const type = await ContainerType.create({ name, price });
        res.status(201).json(type);
    } catch (error) { next(error); }
};

export const deleteContainerType = async (req, res, next) => {
    try {
        await ContainerType.findByIdAndDelete(req.params.id);
        res.json({ message: 'Container removed' });
    } catch (error) { next(error); }
};

// ---- VESSEL SCHEDULES ----
export const getSchedules = async (req, res, next) => {
    try {
        const schedules = await VesselSchedule.find({});
        res.json(schedules);
    } catch (error) { next(error); }
};

export const createSchedule = async (req, res, next) => {
    try {
        const { vesselName, originPort, destPort, transitDays } = req.body;
        const schedule = await VesselSchedule.create({ vesselName, originPort, destPort, transitDays });
        res.status(201).json(schedule);
    } catch (error) { next(error); }
};

export const deleteSchedule = async (req, res, next) => {
    try {
        await VesselSchedule.findByIdAndDelete(req.params.id);
        res.json({ message: 'Schedule removed' });
    } catch (error) { next(error); }
};

// ---- OCEAN BOOKINGS ----
export const createOceanBooking = async (req, res, next) => {
    try {
        const { scheduleId, containerTypeId, weight, loadDate, paymentIntentId } = req.body;

        const schedule = await VesselSchedule.findById(scheduleId);
        if (!schedule) return res.status(404).json({ message: 'Schedule not found' });

        const containerType = await ContainerType.findById(containerTypeId);
        if (!containerType) return res.status(404).json({ message: 'Container Option not found' });

        // ETA / Departure Logic
        const ld = new Date(loadDate);
        const dep = new Date(ld);
        dep.setDate(dep.getDate() + 1); // Depart 1 day after load
        const eta = new Date(dep);
        eta.setDate(eta.getDate() + schedule.transitDays); // ETA based on transit

        const totalCharges = containerType.price + (weight * 0.5); // base price + 50 cents per kg dummy logic

        const booking = await OceanBooking.create({
            schedule: scheduleId,
            containerType: containerTypeId,
            weight,
            loadDate: ld,
            departureDate: dep,
            eta,
            totalCharges,
            customer: req.user?.id
        });

        // Generate Automated Invoice
        await Invoice.create({
            customer: req.user.id,
            serviceType: 'Ocean Freight',
            bookingId: booking.bolNumber,
            amount: totalCharges,
            tax: totalCharges * 0.1,
            totalAmount: totalCharges * 1.1,
            status: 'Paid',
            paymentIntentId
        });

        await booking.populate(['schedule', 'containerType']);
        res.status(201).json(booking);
    } catch (error) {
        console.error("Ocean Booking Error:", error.message);
        res.status(500).json({ message: error.message });
    }
};

export const getOceanBookings = async (req, res, next) => {
    try {
        let query = {};
        if (req.user.role !== 'admin' && req.user.role !== 'manager') {
            query.customer = req.user.id;
        }

        const bookings = await OceanBooking.find(query)
            .populate('schedule')
            .populate('containerType')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) { next(error); }
};

export const trackOceanBooking = async (req, res, next) => {
    try {
        const booking = await OceanBooking.findOne({ bolNumber: req.params.bol })
            .populate('schedule')
            .populate('containerType')
        if (!booking) return res.status(404).json({ message: 'Bill of Lading not found' });
        res.json(booking);
    } catch (error) { next(error); }
};

export const updateOceanStatus = async (req, res, next) => {
    try {
        const { containerStatus, vesselStatus } = req.body;
        const booking = await OceanBooking.findById(req.params.id);

        if (booking) {
            if (containerStatus) booking.containerStatus = containerStatus;
            if (vesselStatus) booking.vesselStatus = vesselStatus;
            await booking.save();
            res.json(booking);
        } else {
            res.status(404).json({ message: 'Booking not found' });
        }
    } catch (error) { next(error); }
};

export const updateBolOption = async (req, res, next) => {
    try {
        const { bolOption } = req.body;
        const booking = await OceanBooking.findById(req.params.id);

        if (booking) {
            booking.bolOption = bolOption;
            await booking.save();
            res.json(booking);
        } else {
            res.status(404).json({ message: 'Booking not found' });
        }
    } catch (error) { next(error); }
};
