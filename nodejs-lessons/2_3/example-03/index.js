// GET /api/v1/products?category=electronics&minPrice=100&maxPrice=500&sort=-price&search=laptop

router.get("/products", async (req, res) => {
  const {
    category,
    minPrice,
    maxPrice,
    inStock,
    sort = "createdAt",
    search,
    page = 1,
    limit = 20
  } = req.query;

  // Build filter object
  const filters = {};

  if (category) {
    filters.category = category;
  }

  if (minPrice || maxPrice) {
    filters.price = {};
    if (minPrice) filters.price.$gte = Number(minPrice);
    if (maxPrice) filters.price.$lte = Number(maxPrice);
  }

  if (inStock !== undefined) {
  }

  // Search across multiple fields
  if (search) {
    filters.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } }
    ];
  }

  // Parse sort (- prefix means descending)
  const sortField = sort.startsWith("-") ? sort.substring(1) : sort;
  const sortOrder = sort.startsWith("-") ? -1 : 1;
  const sortObj = { [sortField]: sortOrder };

  // Execute query
  const products = await Product.find(filters)
    .sort(sortObj)
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit));

  const total = await Product.countDocuments(filters);

  res.json({
    data: products,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / limit)
    },
    filters: {
      category,
      priceRange: { min: minPrice, max: maxPrice },
      search
    }
  });
});

// Field selection - only return specific fields
// GET /api/v1/users?fields=name,email,createdAt

router.get("/users", async (req, res) => {
  const { fields } = req.query;

  let query = User.find();

  if (fields) {
    // Convert "name,email,createdAt" to "name email createdAt"
    const selectedFields = fields.split(",").join(" ");
    query = query.select(selectedFields);
  }

  const users = await query;
  res.json({ data: users });
});