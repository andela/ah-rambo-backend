/**
 * @name paginationValues
 * @description function that returns offset and limit for pagination
 * @param {Object} query object with page and pageItems as integers
 * @returns {(offset|limit)} offset and limit to pagenate request
 */
const paginationValues = ({ page, pageItems }) => {
  const defaultPage = 1;
  const defaultPageItems = 10;
  const base = 10;

  let parsedPage = parseInt(page, base);
  let parsedPageItems = parseInt(pageItems, base);

  if (Number.isNaN(parsedPage)) {
    parsedPage = defaultPage;
  }
  if (Number.isNaN(parsedPageItems)) {
    parsedPageItems = defaultPageItems;
  }

  const offset = (parsedPage - 1) * parsedPageItems;
  const limit = offset + parsedPageItems;
  return { offset, limit };
};

/**
 * @name pageCounter
 * @param {Number} count Number of items returned from query
 * @param {Number} page Page number to be returned
 * @param {Number} pageItems Number of items on page
 * @returns {(totalPages|itemsOnPage)} object with number of items returned
 */
const pageCounter = (count, page, pageItems) => {
  const totalPages = Math.ceil(count / pageItems);
  const lastPage = count - (page - 1) * pageItems;
  const totalPageCheck = totalPages === page || totalPages === 0;
  const itemsOnPage = totalPageCheck ? lastPage : pageItems;
  return { totalPages, itemsOnPage };
};

export { paginationValues, pageCounter };
