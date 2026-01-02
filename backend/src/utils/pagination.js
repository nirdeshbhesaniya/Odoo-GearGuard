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

  const [docs, total] = await Promise.all([
    query.exec(),
    model.countDocuments(filter),
  ]);

  return {
    docs,
    page,
    limit,
    totalDocs: total,
    totalPages: Math.ceil(total / limit),
  };
};
