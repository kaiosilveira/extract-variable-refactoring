const { price } = require('./function');

describe('price', () => {
  describe('shipping', () => {
    it('should charge 10 percent of the total price if the resulting amount is lower than 100', () => {
      const order = { quantity: 400, itemPrice: 1 };
      const result = price(order);
      expect(result).toEqual(440);
    });

    it('should charge a maximum amount of 100 if ten percent of the base price of the order is higher than 100', () => {
      const order = { quantity: 1, itemPrice: 2000 };
      const result = price(order);
      expect(result).toEqual(2100);
    });
  });

  describe('discount', () => {
    it('should not apply a discount if the order has less than 500 units', () => {
      const order = { quantity: 400, itemPrice: 1 };
      const result = price(order);
      expect(result).toEqual(440);
    });

    it('should apply a discount of 5% per item above 500 units', () => {
      const order = { quantity: 1000, itemPrice: 1 };
      const result = price(order);
      expect(result).toEqual(1075);
    });
  });
});
