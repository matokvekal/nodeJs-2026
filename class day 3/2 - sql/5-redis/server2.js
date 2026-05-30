import redis from "ioredis";
import axios from "axios";
import express from "express";

const PORT = 5000;
const REDIS_PORT = 6379;

const client = redis.createClient(REDIS_PORT);
const app = express();

client.on("error", (error) => {
  console.error("Redis client error:", error);
});

function formatOutput(username, numOfRepos) {
  return `<h2>${username} has ${numOfRepos} Github repos</h2>`;
}

// Request data from github
async function getRepos(req, res) {
  try {
    const userName = req.params.userName;
    const response = await axios.get(`https://api.github.com/users/${userName}`);
    const { public_repos } = response.data;

    // Cache data to redis
    client.set(userName, public_repos.toString());
    console.log("Data cached to redis");
    res.send(formatOutput(userName, public_repos));
  } catch (err) {
    console.error(err);
    res.status(404).send("User not found.");
  }
}

// Cache middleware
function cache(req, res, next) {
  console.log("cache middleware")
  const userName = req.params.userName;
  client.get(userName, (err, data) => {
    if (err) throw err;
    if (data !== null) {
      res.send(formatOutput(userName, data));
    } else {
      next();
    }
  });
}

app.get("/repos/:userName", cache, getRepos);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
