const Router = require('koa-router');
const queries = require('../db/queries/items');

const router = new Router();
const BASE_URL = `/api/v1/items`;

router.get(BASE_URL, async(ctx) => {
    try {
        const items = await queries.getAllItems();
        ctx.body = {
            status: 'success',
            data: items
        };
    } catch(err) {
        console.log(err)
    }
});

router.get(`${BASE_URL}/:id`, async (ctx) => {
    try {
        const item = await queries.getSingleItem(ctx.params.id);
        if(item.length) {
            ctx.body = {
                status: 'success',
                data: item
            };
        } else {
            ctx.status = 404;
            ctx.body = {
                status: 'error',
                message: 'That item does not exist.'
            };
        }        
    } catch (err) {
        console.log(err)
    }
});

router.post(`${BASE_URL}`, async(ctx) => {
    try {
        const item = await queries.addItem(ctx.request.body);
        if(item.length) {
            ctx.status = 201;
            ctx.body = {
                status: 'success',
                data: item
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

module.exports = router;
