exports.seed = (knex, Promise) => {
    return knex('sales').del()
        .then(() => {
            return knex('sales').insert({
                value: 15000,
                paid: true,
                paidValue: 15000
            });
        })
        .then(() => {
            return knex('sales').insert({
                value: 8000,
                paid: false,
                paidValue: 1500,
                debtor: "Federico"
            });
        })
        .then(() => {
            return knex('sales').insert({
                value: 12000,
                paid: false,
                paidValue: 0,
                debtor: "Andres"
            });
        });
};
