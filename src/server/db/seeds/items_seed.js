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
        })
        .then(() => {
            return knex('items').insert({
                name: 'Block cuadriculado 100 hojas',
                price: 2500,
                nAvailable: 6
            });
        })
        .then(() => {
            return knex('items').insert({
                name: 'Block rayado 100 hojas',
                price: 2500,
                nAvailable: 12
            });
        })
        .then(() => {
            return knex('items').insert({
                name: 'Pliego de cartulina',
                price: 600,
                nAvailable: 25
            });
        });
};
