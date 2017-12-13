exports.seed = (knex, Promise) => {
    return knex('items').del()
        .then(() => {
            return knex('items').insert({
                name: 'Cuaderno rayado 50 hojas',
                price: 1200,
                nAvailable: 10
            });
        })
        .then(() => {
            return knex('items').insert({
                name: 'Cuaderno cuadriculado 100 hojas',
                price: 1800,
                nAvailable: 20
            });
        })
        .then(() => {
            return knex('items').insert({
                name: 'Caja de colores grande',
                price: 25000,
                nAvailable: 4
            });
        });
};
