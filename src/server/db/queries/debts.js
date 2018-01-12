const knex = require('../connection');

function getAllDebts() {
    return knex('debts')
        .select('*');
}

function getSingleDebt(id) {
    return knex('debts')
        .select('*')
        .where({
            id: parseInt(id)
        });
}

function addDebt(debt) {
    return knex('debts')
        .insert(debt)
        .returning('*');
}

function updateDebt(id, debt) {
    // Update the updatedAt
    debt.updatedAt = knex.fn.now();
    // Update the debt
    return knex('debts')
        .update(debt)
        .where({
            id: parseInt(id)
        })
        .returning('*');
}

function deleteDebt(id) {
    return knex('debts')
        .del()
        .where({
            id: parseInt(id)
        })
        .returning('*');
}

module.exports = {
    getAllDebts,
    getSingleDebt,
    addDebt,
    updateDebt,
    deleteDebt
};
