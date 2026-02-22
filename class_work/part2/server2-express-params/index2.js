import express from "express";
import fs from "fs";
import path from "path";
const app = express();
const PORT = 3000;

 import { dirname ,join} from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

app.get("/getcities", (req, res) => {
  const data = fs.readFileSync(path.resolve("world.json"));
  const cities = JSON.parse(data);
  res.send(cities);

  const DATA = fs.readFileSync(join(__dirname, "world.json"));
  //TRY this
  // res.json(DATA)
});

const filterCities = (data, { minpopulation, maxpopulation, city, country }) => {
  const cities = data.filter((item) => {
    return (
      (!minpopulation || item.Population >= Number(minpopulation)) &&
      (!maxpopulation || item.Population <= Number(maxpopulation)) &&
      (!city || item.City.toLowerCase().startsWith(city.toLowerCase())) &&
      (!country || item.Country.toLowerCase().startsWith(country.toLowerCase()))
    );
  });
  return cities;
};

// //http://localhost:3000/city?minpopulation=30290934&maxpopulation=30290934
// //http://localhost:3000/city?city=to&&ountry=ja
// http://localhost:3000/city?minpopulation=20000000
// //http://localhost:3000/city?maxpopulation=20000000
// http://localhost:3000/city?city=Delhi
// http://localhost:3000/city?country=China

app.get("/city", (req, res) => {
  const data = fs.readFileSync(path.resolve("world.json"));
  const cities = JSON.parse(data);

  const filtercities = filterCities(cities, req.query);

  res.json({ allCities: filtercities });
});

//using params with users file
app.get("/users/:id?", (req, res) => {
  const id = req.params.id;
  const data = fs.readFileSync(path.resolve("users.json"));
  const users = JSON.parse(data);
  if (id) {
    const user = users.find((user) => user.id === Number(id));
    res.json(user);
  } else {
    res.json(users);
  }
  res.json(users);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
