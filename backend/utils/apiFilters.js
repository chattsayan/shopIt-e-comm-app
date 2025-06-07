export const applySearch = (query, queryStr) => {
  const keyword = queryStr.keyword
    ? {
        name: {
          $regex: queryStr.keyword,
          $options: "i",
        },
      }
    : {};

  return query.find({ ...keyword });
};

export const applyFilters = (query, queryStr) => {
  const queryCopy = { ...queryStr };
  const removeFields = ["keyword", "page", "limit"];
  removeFields.forEach((field) => delete queryCopy[field]);

  const filterQuery = {};

  Object.keys(queryCopy).forEach((key) => {
    if (key.includes("[")) {
      const [field, operator] = key.split(/\[|\]/).filter(Boolean);
      if (!filterQuery[field]) filterQuery[field] = {};
      filterQuery[field][`$${operator}`] = Number(queryCopy[key]);
    } else {
      filterQuery[key] = queryCopy[key];
    }
  });

  return query.find(filterQuery);
};

export const applyPagination = (query, queryStr, resultsPerPage) => {
  const currentPage = Number(queryStr.page) || 1;
  const skip = resultsPerPage * (currentPage - 1);

  return query.limit(resultsPerPage).skip(skip);
};

/**
class APIFilters {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  filters() {
    const queryCopy = { ...this.queryStr };

    // Removing fields for category
    const removeFields = ["keyword", "page", "limit"];
    removeFields.forEach((field) => delete queryCopy[field]);

    // Filter for price and rating
    const filterQuery = {};

    Object.keys(queryCopy).forEach((key) => {
      if (key.includes("[")) {
        const [field, operator] = key.split(/\[|\]/).filter(Boolean);
        if (!filterQuery[field]) filterQuery[field] = {};
        filterQuery[field][`$${operator}`] = Number(queryCopy[key]);
      } else {
        filterQuery[key] = queryCopy[key];
      }
    });

    this.query = this.query.find(filterQuery);
    return this;
  }

  pagination(resultsPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resultsPerPage * (currentPage - 1);

    this.query = this.query.limit(resultsPerPage).skip(skip);
    return this;
  }
}

export default APIFilters;
 */
