// pharmacyai-backend/src/routes/index.js

const UserRouter = require('./UserRouter');
const ProductRouter = require('./ProductRouter');
const OrderRouter = require('./OrderRouter');
const PaymentRouter = require('./PaymentRouter');
const TypeRouter = require('./TypeRouter');
const AddressRouter = require('./AddressRouter');
const OrderStatsRouter = require('./OrderStatsRouter');
const PrescriptionRouter = require('./PrescriptionRouter');

const routes = (app) => {
    app.use('/api/user', UserRouter);
    app.use('/api/product', ProductRouter);
    app.use('/api/order', OrderRouter);
    app.use('/api/payment', PaymentRouter);
    app.use('/api/type', TypeRouter);
    app.use('/api/address', AddressRouter);
    app.use('/api/stats', OrderStatsRouter);
    app.use('/api/prescription', PrescriptionRouter);
};

module.exports = routes;