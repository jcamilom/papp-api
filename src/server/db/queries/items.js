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

function updateItem(id, item) {
    return knex('items')
        .update(item)
        .where({
            id: parseInt(id)
        })
        .returning('*');
}

function deleteItem(id) {
    return knex('items')
        .del()
        .where({
            id: parseInt(id)
        })
        .returning('*');
}

module.exports = {
    getAllItems,
    getSingleItem,
    addItem,
    updateItem,
    deleteItem
};
