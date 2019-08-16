/**
 * @name pageParser
 * @param {Number} page Page number to be returned
 * @param {Number} pageItems Number of items on page
 * @returns {Object} parsed values of arguments
 */
const pageParser = (page, pageItems) => {
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

  return { parsedPage, parsedPageItems };
};

/**
 * @name paginationValues
 * @description function that returns offset and limit for pagination
 * @param {Object} query object with page and pageItems as integers
 * @returns {(offset|limit)} offset and limit to pagenate request
 */
const paginationValues = ({ page, pageItems }) => {
  const { parsedPage, parsedPageItems } = pageParser(page, pageItems);
  const offset = (parsedPage - 1) * parsedPageItems;
  const limit = parsedPageItems;
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
  const { parsedPage, parsedPageItems } = pageParser(page, pageItems);
  let itemsOnPage;
  const totalPages = Math.ceil(count / parsedPageItems);
  const lastPage = count - (parsedPage - 1) * parsedPageItems;
  const totalPageCheck = totalPages === parsedPage;
  if (totalPages < parsedPage) {
    itemsOnPage = 0;
  } else {
    itemsOnPage = totalPageCheck ? lastPage : parsedPageItems;
  }

  return { totalPages, itemsOnPage, parsedPage };
};

export { paginationValues, pageCounter };
