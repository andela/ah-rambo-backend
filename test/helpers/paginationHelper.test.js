import { expect } from 'chai';
import { paginationValues, pageCounter } from '../../server/helpers';

describe('Pagination values function test', () => {
  context('when the pagination function is called without values', () => {
    it('returns the default values for offset and limit', () => {
      const values = paginationValues({});
      expect(values).to.be.an('object');
      expect(values).to.have.property('offset', 0);
      expect(values).to.have.property('limit', 10);
    });
  });

  context('when the pagination function is called with values', () => {
    it('returns those values for offset and limit', () => {
      const values = paginationValues({ page: 2, pageItems: 7 });
      expect(values).to.be.an('object');
      expect(values).to.have.property('offset', 7);
      expect(values).to.have.property('limit', 14);
    });
  });
});

context('when the pagination function is called with characters', () => {
  it('returns the default values for offset and limit', () => {
    const values = paginationValues({ page: 'n', pageItems: 't' });
    expect(values).to.be.an('object');
    expect(values).to.have.property('offset', 0);
    expect(values).to.have.property('limit', 10);
  });

  it('returns the default values for limit passed a character', () => {
    const values = paginationValues({ page: 4, pageItems: 't' });
    expect(values).to.be.an('object');
    expect(values).to.have.property('offset', 30);
    expect(values).to.have.property('limit', 40);
  });

  it('returns the default values for offset passed a character', () => {
    const values = paginationValues({ page: 'f', pageItems: 8 });
    expect(values).to.be.an('object');
    expect(values).to.have.property('offset', 0);
    expect(values).to.have.property('limit', 8);
  });
});

describe('Page Counter Test', () => {
  context('when the counter function is passed valid values', () => {
    it('returns information about the paginated pages', () => {
      const values = pageCounter(15, 2, 6);
      const { totalPages, itemsOnPage } = values;
      expect(values).to.be.an('object');
      expect(totalPages).to.equal(3);
      expect(itemsOnPage).to.equal(6);
    });

    it('returns correct information on last page numbers', () => {
      const values = pageCounter(31, 4, 8);
      const { totalPages, itemsOnPage } = values;
      expect(values).to.be.an('object');
      expect(totalPages).to.equal(4);
      expect(itemsOnPage).to.equal(7);
    });
  });
});
