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

function addItem(item) {
    return knex('items')
        .insert(item)
        .returning('*');
}

module.exports = {
    getAllItems,
    getSingleItem,
    addItem
};
