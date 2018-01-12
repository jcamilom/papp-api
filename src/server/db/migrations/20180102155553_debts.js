exports.up = (knex, Promise) => {
    return knex.schema.createTable('debts', (table) => {
        table.increments();
        table.integer('saleId').notNullable();
        table.timestamp('createdAt').defaultTo(knex.fn.now()).notNullable();
        table.timestamp('updatedAt').nullable();
        table.integer('value').notNullable();
        table.boolean('paid').notNullable();
        table.integer('paidValue').notNullable();
        table.string('debtor').notNullable();
    });
};

exports.down = (knex, Promise) => {
    return knex.schema.dropTable('debts');
};
