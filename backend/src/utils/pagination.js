/**
 * Paginate results
 * @param {Model} model - Mongoose model
 * @param {Object} filter - Query filter
 * @param {Object} options - Pagination options
 */
exports.paginate = async (model, filter = {}, options = {}) => {
  const {
    page = 1,
    limit = 10,
    sort = '-createdAt',
    select = '',
    populate = '',
  } = options;

  const skip = (page - 1) * limit;

  const query = model.find(filter).skip(skip).limit(limit).sort(sort);

  if (select) query.select(select);
  if (populate) query.populate(populate);

  const [data, total] = await Promise.all([
    query.exec(),
    model.countDocuments(filter),
  ]);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};
