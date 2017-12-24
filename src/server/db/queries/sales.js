const knex = require('../connection');

function getAllSales() {
    return knex('sales')
        .select('*');
}

function getSingleSale(id) {
    return knex('sales')
        .select('*')
        .where({
            id: parseInt(id)
        });
}

function addSale(sale) {
    return knex('sales')
        .insert(sale)
        .returning('*');
}

function updateSale(id, sale) {
    // Update the updatedAt
    sale.updatedAt = knex.fn.now();
    // Update the sale
    return knex('sales')
        .update(sale)
        .where({
            id: parseInt(id)
        })
        .returning('*');
}

function deleteSale(id) {
    return knex('sales')
        .del()
        .where({
            id: parseInt(id)
        })
        .returning('*');
}

module.exports = {
    getAllSales,
    getSingleSale,
    addSale,
    updateSale,
    deleteSale
};
