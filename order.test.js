const { Order } = require('./order');

describe('Order', () => {
  describe('quantity', () => {
    it('should has a quantity prop matching the record passed as the data source', () => {
      const aRecord = { quantity: 400, itemPrice: 1 };
      const order = new Order(aRecord);
      expect(order.quantity).toEqual(aRecord.quantity);
    });
  });

  describe('itemPrice', () => {
    it('should has an itemPrice prop matching the record passed as the data source', () => {
      const aRecord = { quantity: 400, itemPrice: 1 };
      const order = new Order(aRecord);
      expect(order.itemPrice).toEqual(aRecord.itemPrice);
    });
  });

  describe('price', () => {
    describe('shipping', () => {
      it('should charge 10 percent of the total price if the resulting amount is lower than 100', () => {
        const order = new Order({ quantity: 400, itemPrice: 1 });
        const result = order.price;
        expect(result).toEqual(440);
      });

      it('should charge a maximum amount of 100 if ten percent of the base price of the order is higher than 100', () => {
        const order = new Order({ quantity: 1, itemPrice: 2000 });
        const result = order.price;
        expect(result).toEqual(2100);
      });
    });

    describe('discount', () => {
      it('should not apply a discount if the order has less than 500 units', () => {
        const order = new Order({ quantity: 400, itemPrice: 1 });
        const result = order.price;
        expect(result).toEqual(440);
      });

      it('should apply a discount of 5% per item above 500 units', () => {
        const order = new Order({ quantity: 1000, itemPrice: 1 });
        const result = order.price;
        expect(result).toEqual(1075);
      });
    });
  });
});
