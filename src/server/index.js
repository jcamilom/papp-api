const Koa = require('koa');
const bodyParser = require('koa-bodyparser');

const cors = require('@koa/cors');

const indexRoutes = require('./routes/index');
const itemRoutes = require('./routes/items');
const salesRoutes = require('./routes/sales');
const debtsRoutes = require('./routes/debts');

const app = new Koa();
const PORT = process.env.PORT || 1337;

app.use(bodyParser());
app.use(cors());
app.use(indexRoutes.routes());
app.use(itemRoutes.routes());
app.use(salesRoutes.routes());
app.use(debtsRoutes.routes());

const server = app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
});

module.exports = server;
