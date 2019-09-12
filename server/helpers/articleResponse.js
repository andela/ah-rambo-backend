/**
 * @name articleResponse
 * @param {Object} res express response object
 * @param {Number} code status code to return
 * @param {Object} article object with response details
 * @param {Object} token strings
 * @returns {JSON} JSON response with status and response information
 */
const articleResponse = (res, code, article) => {
  const {
    dataValues: {
      isArchived,
      Category,
      categoryId,
      authorId,
      tags,
      ...articleData
    }
  } = article;
  if (Category) {
    articleData.category = Category.name;
  }
  articleData.tagList = tags.map(({ name }) => name);
  return res.status(code).json({ article: articleData });
};
export default articleResponse;
