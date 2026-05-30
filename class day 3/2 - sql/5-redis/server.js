import redis from "ioredis";
import express from "express";

const PORT = 5001;
const app = express();
app.use(express.json());

const redis = new Redis({
  host: "127.0.0.1",
  port: 6379,
});

const startServer = async () => {
  try {
    let customerName = await redis.get("customer_name");
    if (!customerName) {
      // Create a new record
      await redis.set("customer_name", "John Doe");
      console.log("Writing Property: customer_name");
    } else {
      console.log(`Reading property: customer_name - ${customerName}`);
    }
  } catch (error) {
    console.error("Error occurred:", error);
  }

  app.get("/", (req, res) => {
    res.status(200).json({
      message: "Sample Docker Redis Application",
    });
  });

  app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
  });
};
app.get("/set", async (req, res) => {
  const { key, value } = req.query;

  if (!key || !value) {
    return res
      .status(400)
      .json({ message: "Please provide both a key and a value." });
  }

  try {
    await redis.set(key, value);
    res.status(200).json({ message: "Value set successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error setting value in Redis.", error });
  }
});

app.get("/get", async (req, res) => {
  const { key } = req.query;

  if (!key) {
    return res.status(400).json({ message: "Please provide a key." });
  }

  try {
    const value = await redis.get(key);
    if (value) {
      res.status(200).json({ key, value });
    } else {
      res.status(404).json({ message: "Key not found in Redis." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching value from Redis.", error });
  }
});
startServer();
