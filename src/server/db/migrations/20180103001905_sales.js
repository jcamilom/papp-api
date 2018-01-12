exports.up = (knex, Promise) => {
    return knex.schema.createTable('sales', (table) => {
        table.increments();
        table.timestamp('createdAt').defaultTo(knex.fn.now()).notNullable();
        table.timestamp('updatedAt').nullable();
        table.integer('value').notNullable();
        table.boolean('paid').notNullable();
        table.integer('paidValue').notNullable();
        table.string('debtor').nullable();
    });
};

exports.down = (knex, Promise) => {
    return knex.schema.dropTable('sales');
};
