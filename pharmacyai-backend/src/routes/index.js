// Đảm bảo đã import AddressRouter trong routes/index.js
const UserRouter = require('./UserRouter');
const ProductRouter = require('./ProductRouter');
const OrderRouter = require('./OrderRouter');
const PaymentRouter = require('./PaymentRouter');
const TypeRouter = require('./TypeRouter');
const AddressRouter = require('./AddressRouter');

const routes = (app) => {
    app.use('/api/user', UserRouter);
    app.use('/api/product', ProductRouter);
    app.use('/api/order', OrderRouter);
    app.use('/api/payment', PaymentRouter);
    app.use('/api/type', TypeRouter);
    app.use('/api/address', AddressRouter);
};

module.exports = routes;