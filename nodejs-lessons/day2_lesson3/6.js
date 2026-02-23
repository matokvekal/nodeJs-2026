// HATEOAS: Include links to related resources in responses
router.get("/users/:id", async (req, res) => {
  const user = await User.findById(req.params.id);

  res.json({
    data: {
      id: user.id,
      name: user.name,
      email: user.email
    },
    links: {
      self: { href: `/api/v1/users/${user.id}`, method: "GET" },
      update: { href: `/api/v1/users/${user.id}`, method: "PUT" },
      delete: { href: `/api/v1/users/${user.id}`, method: "DELETE" },
      posts: { href: `/api/v1/users/${user.id}/posts`, method: "GET" },
      avatar: { href: `/api/v1/users/${user.id}/avatar`, method: "GET" }
    }
  });
});

// Collection with pagination links
router.get("/users", async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = 20;

  const users = await User.find()
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await User.countDocuments();
  const totalPages = Math.ceil(total / limit);

  res.json({
    data: users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      links: {
        self: { href: `/api/v1/users/${u.id}` }
      }
    })),
    links: {
      self: { href: `/api/v1/users?page=${page}` },
      first: { href: "/api/v1/users?page=1" },
      last: { href: `/api/v1/users?page=${totalPages}` },
      ...(page > 1 && { prev: { href: `/api/v1/users?page=${page - 1}` } }),
      ...(page < totalPages && {
        next: { href: `/api/v1/users?page=${page + 1}` }
      })
    },
    meta: {
      page,
      limit,
      total,
      totalPages
    }
  });
});