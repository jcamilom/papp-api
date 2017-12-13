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
      ctx.body = {
        status: 'success',
        data: item
      };
    } catch (err) {
      console.log(err)
    }
});

module.exports = router;
