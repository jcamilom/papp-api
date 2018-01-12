const Router = require('koa-router');
const queries = require('../db/queries/debts');

const router = new Router();
const BASE_URL = `/api/v1/debts`;

router.get(BASE_URL, async(ctx) => {
    try {
        const debts = await queries.getAllDebts();
        ctx.body = {
            status: 'success',
            data: debts
        };
    } catch(err) {
        console.log(err);
    }
});

router.get(`${BASE_URL}/:id`, async (ctx) => {
    try {
        const debt = await queries.getSingleDebt(ctx.params.id);
        if(debt.length) {
            ctx.body = {
                status: 'success',
                data: debt
            };
        } else {
            ctx.status = 404;
            ctx.body = {
                status: 'error',
                message: 'That debt does not exist.'
            };
        }        
    } catch (err) {
        console.log(err)
    }
});

router.post(`${BASE_URL}`, async(ctx) => {
    try {
        const debt = await queries.addDebt(ctx.request.body);
        if(debt.length) {
            ctx.status = 201;
            ctx.body = {
                status: 'success',
                data: debt
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
        const debt = await queries.updateDebt(ctx.params.id, ctx.request.body);
        if(debt.length) {
            ctx.status = 200;
            ctx.body = {
                status: 'success',
                data: debt
            };
        } else {
            ctx.status = 404;
            ctx.body = {
                status: 'error',
                message: 'That debt does not exist.'
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
        const debt = await queries.deleteDebt(ctx.params.id);
        if(debt.length) {
            ctx.status = 200;
            ctx.body = {
                status: 'success',
                data: debt
            };
        } else {
            ctx.status = 404;
            ctx.body = {
                status: 'error',
                message: 'That debt does not exist.'
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
