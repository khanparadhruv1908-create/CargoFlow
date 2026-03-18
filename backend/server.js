import express from 'express';
import http from 'http';
import cors from 'cors';
import morgan from 'morgan';
import { Server } from 'socket.io';
import { connectDB } from './config/db.js';
import { PORT } from './config/env.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import { logger } from './utils/logger.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import shipmentRoutes from './routes/shipmentRoutes.js';
import trackingRoutes from './routes/trackingRoutes.js';
import billingRoutes from './routes/billingRoutes.js';
import customsRoutes from './routes/customsRoutes.js';
import warehouseRoutes from './routes/warehouseRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import airlineRoutes from './routes/airlineRoutes.js';
import airBookingRoutes from './routes/airBookingRoutes.js';
import oceanRoutes from './routes/oceanRoutes.js';

connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Attach io to req
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev', { stream: { write: message => logger.info(message.trim()) } }));

// Socket.io for Real-time Tracking
io.on('connection', (socket) => {
    logger.info(`Socket connected: ${socket.id}`);

    socket.on('join_shipment', (shipmentId) => {
        socket.join(shipmentId);
        logger.info(`Socket ${socket.id} joined shipment ${shipmentId}`);
    });

    socket.on('disconnect', () => {
        logger.info(`Socket disconnected: ${socket.id}`);
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/invoices', billingRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/airlines', airlineRoutes);
app.use('/api/air-bookings', airBookingRoutes);
app.use('/api/ocean', oceanRoutes);
app.use('/api/customs', customsRoutes);
app.use('/api/warehouse', warehouseRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

server.listen(PORT, () => {
    logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
