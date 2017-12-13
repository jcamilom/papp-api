exports.up = (knex, Promise) => {
    return knex.schema.createTable('items', (table) => {
        table.increments();
        table.string('name').notNullable().unique();        
        table.integer('nAvailable').notNullable();
        table.bigint('price').notNullable();
    });
};

exports.down = (knex, Promise) => {
    return knex.schema.dropTable('items');
};
