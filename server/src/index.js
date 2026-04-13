// ---------------------------------
// Boilerplate Code to Set Up Server
// ---------------------------------
import express from "express";
import pg from "pg";
import cors from "cors";

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

// ---------------------------------
// Helper Functions
// ---------------------------------

async function getAllFoodTrucks() {
  const result = await db.query("SELECT * FROM food_trucks;");
  return result.rows;
}

async function getFoodTruckById(id) {
  const result = await db.query(
    "SELECT * FROM food_trucks WHERE id = $1",
    [id]
  );
  return result.rows[0];
}

async function getTopRatedFoodTrucks() {
  const result = await db.query(
    "SELECT * FROM food_trucks WHERE rating >= 4.5"
  );
  return result.rows;
}

async function sortedByPrice() {
  const result = await db.query(
    "SELECT name, id, price_level FROM food_trucks ORDER BY price_level DESC"
  );
  return result.rows;
}

async function getFoodTrucksCount() {
  const result = await db.query("SELECT COUNT(*) FROM food_trucks");
  return result.rows[0];
}

async function addOneFoodTruck(
  name,
  current_location,
  daily_special,
  slogan,
  has_vegan_options,
  price_level,
  rating
) {
  const result = await db.query(
    `INSERT INTO food_trucks
     (name, current_location, daily_special, slogan, has_vegan_options, price_level, rating)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      name,
      current_location,
      daily_special,
      slogan,
      has_vegan_options,
      price_level,
      rating,
    ]
  );

  return result.rows[0];
}

async function deleteOneFoodTruck(id) {
  const truckName = await db.query(
    `SELECT name FROM food_trucks WHERE id = $1`,
    [id]
  );

  if (truckName.rows.length === 0) {
    return `No truck found with id ${id}`;
  }

  await db.query(`DELETE FROM food_trucks WHERE id = $1`, [id]);

  const name = truckName.rows[0].name;

  return `Success! Food truck #${id}, ${name} was deleted!`;
}

async function updateFoodTruckLocation(id, newLocation) {
  const result = await db.query(
    "UPDATE food_trucks SET current_location = $1 WHERE id = $2",
    [newLocation, id]
  );

  return result;
}

// ---------------------------------
// API Endpoints
// ---------------------------------

app.get("/get-all-food-trucks", async (req, res) => {
  const trucks = await getAllFoodTrucks();
  res.json(trucks);
});

app.get("/get-food-truck-by-id/:id", async (req, res) => {
  const id = req.params.id;
  const foodTruck = await getFoodTruckById(id);
  res.json(foodTruck);
});

app.get("/get-top-rated-food-trucks", async (req, res) => {
  const trucks = await getTopRatedFoodTrucks();
  res.json(trucks);
});

app.get("/get-food-trucks-sorted-by-price", async (req, res) => {
  const sortedFoodTruckPrice = await sortedByPrice();
  res.json(sortedFoodTruckPrice);
});

app.get("/get-food-trucks-count", async (req, res) => {
  const count = await getFoodTrucksCount();
  res.json(count);
});

app.post("/add-one-food-truck", async (req, res) => {
  const {
    name,
    current_location,
    daily_special,
    slogan,
    has_vegan_options,
    price_level,
    rating,
  } = req.body;

  const truck = await addOneFoodTruck(
    name,
    current_location,
    daily_special,
    slogan,
    has_vegan_options,
    price_level,
    rating
  );

  res.send(`Success! ${truck.name} was added!`);
});

app.post("/delete-one-food-truck/:id", async (req, res) => {
  try {
    let id = req.params.id;
    const result = await deleteOneFoodTruck(id);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error:
        "There was an issue while deleting the food truck. Please review your request and try again",
    });
  }
});

app.post("/update-food-truck-location", async (req, res) => {
  const id = req.body.id;
  const newLocation = req.body.newLocation;

  await updateFoodTruckLocation(id, newLocation);

  res.send("Success! The food truck location was updated!");
});