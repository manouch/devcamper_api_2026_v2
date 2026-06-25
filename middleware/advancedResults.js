const advancedResults = (model, populate) => async (req, res, next) => {
  const reqQuery = { ...req.query };

  // remove special fields
  const removeFields = ["select", "sort", "page", "limit"];
  removeFields.forEach((param) => delete reqQuery[param]);

  const queryObj = {};

  for (let key in reqQuery) {
    // check for operator format: field[op]
    const match = key.match(/(.+)\[(.+)\]/);

    if (match) {
      const field = match[1]; // e.g. careers
      const operator = match[2]; // e.g. in, lte

      if (!queryObj[field]) {
        queryObj[field] = {};
      }

      let value = reqQuery[key];

      // -----------------------------
      // HANDLE "in" OPERATOR (ARRAYS)
      // -----------------------------
      if (operator === "in") {
        value = value.split(","); // supports multiple values
      }

      // -----------------------------
      // HANDLE NUMBERS SAFELY
      // -----------------------------
      if (operator !== "in" && !isNaN(value)) {
        value = Number(value);
      }

      queryObj[field][`$${operator}`] = value;
    } else {
      // normal key-value filters
      queryObj[key] = reqQuery[key];
    }
  }

  console.log("FINAL QUERY OBJECT:", queryObj);

  // const bootcamps = await Bootcamp.find(queryObj);
  let query = model.find(queryObj);

  // SELECT Fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    console.log("SELECT FIELDS:", fields);
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments();

  query = query.skip(startIndex).limit(limit);

  if (populate) {
    query = query.populate(populate);
  }

  // EXECUTE QUERY
  const results = await query;

  // Pagination result
  const pagination = {};
  // const pagination = {
  //   next: null,
  //   prev: null,
  // };

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit: limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results,
  };

  next();
};

module.exports = advancedResults;
