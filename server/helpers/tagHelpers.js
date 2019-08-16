/**
 * @name removeSpecialCharacters
 * @param {String} name name
 * @returns {String} formatted name
 */
const removeSpecialCharacters = name => name.replace(/[^a-z0-9]/gi, '').toLowerCase();
/**
 * @name formatTag
 * @param {String} name name
 * @returns {String} formatted name which allows
 * whitespaces, numbers and letters
 */
const formatTag = (name) => {
  let formattedName = name.replace(/[^a-z0-9\s]/gi, '-').toLowerCase();
  while (/--|-\s+-/.test(formattedName) || /\s\s/.test(formattedName)) {
    formattedName = formattedName
      .replace(/--|-\s+-/gi, '-')
      .replace(/\s\s/gi, ' ')
      .trimEnd()
      .trimStart();
  }
  return formattedName === '-' ? '' : formattedName;
};

/**
 * @name removeDuplicateTags
 * @param {array} tagArray array of tags
 * @returns {array} array of unique tags
 */
const removeDuplicateTags = (tagArray) => {
  const tagWithoutSpecialCharacters = tagArray.map(tag => removeSpecialCharacters(tag));
  return tagArray.filter(
    (tag, index) => tagWithoutSpecialCharacters.indexOf(removeSpecialCharacters(tag))
      === index
  );
};

export { removeSpecialCharacters, formatTag, removeDuplicateTags };
