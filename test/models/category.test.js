import { expect } from 'chai';
import models from '../../server/database/models';

const { Category } = models;

describe('Test Category model validations', () => {
  const validCategoryInfo = { name: 'new category' };

  context('when name is not provided', () => {
    it('returns a validation error', async () => {
      const invalidCategoryInfo = { ...validCategoryInfo };
      delete invalidCategoryInfo.name;

      try {
        await Category.create(invalidCategoryInfo);
      } catch (error) {
        expect(error.message).to.equal(
          'notNull Violation: Category.name cannot be null'
        );
      }
    });
  });

  context('when the custom finder functions are called', () => {
    it('returns the category with the name', async () => {
      const newCategory = await Category.create({ ...validCategoryInfo });
      const category = await Category.findByName(newCategory.name);
      expect(category.name).to.equal(newCategory.name);
    });
  });
});
