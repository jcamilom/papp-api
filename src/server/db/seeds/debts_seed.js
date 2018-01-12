exports.seed = (knex, Promise) => {
  return knex('debts').del()
      .then(() => {
          return knex('debts').insert({
              value: 15000,
              paid: true,
              paidValue: 15000,
              debtor: "Jairo",
              saleId: 12
          });
      })
      .then(() => {
          return knex('debts').insert({
              value: 8000,
              paid: false,
              paidValue: 1500,
              debtor: "Don Raúl",
              saleId: 4
          });
      })
      .then(() => {
          return knex('debts').insert({
              value: 12000,
              paid: false,
              paidValue: 0,
              debtor: "Andres",
              saleId: 10
          });
      });
};
