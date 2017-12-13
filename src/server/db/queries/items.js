const knex = require('../connection');

function getAllItems() {
    return knex('items')
        .select('*');
}

function getSingleItem(id) {
    return knex('items')
        .select('*')
        .where({
            id: parseInt(id)
        });
}

module.exports = {
    getAllItems,
    getSingleItem
};
