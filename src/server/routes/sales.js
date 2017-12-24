const Router = require('koa-router');
const queries = require('../db/queries/sales');

const router = new Router();
const BASE_URL = `/api/v1/sales`;

router.get(BASE_URL, async(ctx) => {
    try {
        const sales = await queries.getAllSales();
        ctx.body = {
            status: 'success',
            data: sales
        };
    } catch(err) {
        console.log(err);
    }
});

router.get(`${BASE_URL}/:id`, async (ctx) => {
    try {
        const sale = await queries.getSingleSale(ctx.params.id);
        if(sale.length) {
            ctx.body = {
                status: 'success',
                data: sale
            };
        } else {
            ctx.status = 404;
            ctx.body = {
                status: 'error',
                message: 'That sale does not exist.'
            };
        }        
    } catch (err) {
        console.log(err)
    }
});

router.post(`${BASE_URL}`, async(ctx) => {
    try {
        const sale = await queries.addSale(ctx.request.body);
        if(sale.length) {
            ctx.status = 201;
            ctx.body = {
                status: 'success',
                data: sale
            };
        } else {
            ctx.status = 400;
            ctx.body = {
                status: 'error',
                message: 'Something went wrong.'
            };
        }
    } catch(err) {
        ctx.status = 400;
        ctx.body = {
            status: 'error',
            message: err.message || 'Sorry, an error has occurred.'
        };
    }
});

router.put(`${BASE_URL}/:id`, async(ctx) => {
    try {
        const sale = await queries.updateSale(ctx.params.id, ctx.request.body);
        if(sale.length) {
            ctx.status = 200;
            ctx.body = {
                status: 'success',
                data: sale
            };
        } else {
            ctx.status = 404;
            ctx.body = {
                status: 'error',
                message: 'That sale does not exist.'
            };
        }
    } catch(err) {
        ctx.status = 400;
        ctx.body = {
            status: 'error',
            message: err.message || 'Sorry, an error has occurred.'
        };
    }
});

router.delete(`${BASE_URL}/:id`, async(ctx) => {
    try {
        const sale = await queries.deleteSale(ctx.params.id);
        if(sale.length) {
            ctx.status = 200;
            ctx.body = {
                status: 'success',
                data: sale
            };
        } else {
            ctx.status = 404;
            ctx.body = {
                status: 'error',
                message: 'That sale does not exist.'
            };
        }
    } catch(err) {
        ctx.status = 400;
        ctx.body = {
            status: 'error',
            message: err.message || 'Sorry, an error has occurred.'
        };
    }
});

module.exports = router;
