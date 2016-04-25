'use strict';

describe('Costumers E2E Tests:', function () {
  describe('Test Costumers page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/costumers');
      expect(element.all(by.repeater('costumer in costumers')).count()).toEqual(0);
    });
  });
});
