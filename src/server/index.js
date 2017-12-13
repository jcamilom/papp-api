const Koa = require('koa');
const indexRoutes = require('./routes/index');
const itemRoutes = require('./routes/items');

const app = new Koa();
const PORT = process.env.PORT || 1337;

app.use(indexRoutes.routes());
app.use(itemRoutes.routes());

const server = app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
});

module.exports = server;
