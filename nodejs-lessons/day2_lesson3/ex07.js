// Bulk create
router.post("/users/bulk", async (req, res) => {
  const { users } = req.body; // Array of user objects

    return res.status(400).json({ error: "users array required" });
  }

  const results = await User.insertMany(users, { ordered: false });

  res.status(201).json({
    data: results,
    meta: {
      created: results.length,
      total: users.length
    }
  });
});

// Bulk update
router.patch("/users/bulk", async (req, res) => {
  const { updates } = req.body; // [{ id: '1', data: {...} }, ...]

  const results = await Promise.allSettled(
    updates.map(({ id, data }) =>
      User.findByIdAndUpdate(id, data, { new: true })
    )
  );

  const succeeded = results
    .map((r) => r.value);

  res.json({
    data: succeeded,
    errors: failed.map((r, i) => ({
      id: updates[i].id,
      error: r.reason.message
    })),
    meta: {
      succeeded: succeeded.length,
      failed: failed.length,
      total: updates.length
    }
  });
});

// Bulk delete
router.delete("/users/bulk", async (req, res) => {
  const { ids } = req.body; // Array of IDs

  const result = await User.deleteMany({ _id: { $in: ids } });

  res.json({
    meta: {
      deleted: result.deletedCount,
      requested: ids.length
    }
  });
});