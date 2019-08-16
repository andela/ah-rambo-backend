/* eslint-disable max-len */
import { expect } from 'chai';
import {
  removeSpecialCharacters,
  formatTag,
  removeDuplicateTags
} from '../../server/helpers';

describe('Tag Helper Test', () => {
  context('when a tag with special characters is supplied', () => {
    it('returns the tag without special characters', async () => {
      const response = removeSpecialCharacters('s%$^%#%^he');
      expect(response).to.equal('she');
    });
  });

  context('when a tag with special is supplied', () => {
    it("replaces all special characters with a '-'", async () => {
      const response = formatTag('j-u_n2e*s');
      expect(response).to.equal('j-u-n2e-s');
    });
  });

  context('when an array of duplicate tags is supplied', () => {
    it('returns an array of unique tags', async () => {
      const response = removeDuplicateTags(['adeola', 'ADEOLA', 'Ade-ola']);
      expect(response).to.be.an('array');
      expect(response.length).to.equal(1);
      expect(response[0]).to.equal('adeola');
    });
  });
});
