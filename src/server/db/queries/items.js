const knex = require('../connection');

function getAllItems() {
    return knex('items')
        .select('*');
}

module.exports = {
    getAllItems
};
