import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

// fake data lives here
let foodTrucks = [
  {
    id: 1,
    name: "Taco Fiesta",
    current_location: "Downtown Las Vegas",
    daily_special: "Street Tacos",
    slogan: "Fresh and fast",
    has_vegan_options: true,
    price_level: 2,
    rating: 4.7,
  },
  {
    id: 2,
    name: "Burger Bus",
    current_location: "Henderson",
    daily_special: "Double Cheeseburger",
    slogan: "Burgers on wheels",
    has_vegan_options: false,
    price_level: 3,
    rating: 4.5,
  },
  {
    id: 3,
    name: "Wrap Star",
    current_location: "Summerlin",
    daily_special: "Chicken Caesar Wrap",
    slogan: "Wrapped up right",
    has_vegan_options: true,
    price_level: 2,
    rating: 4.3,
  },
];

// ---------------------------------
// Helper Functions
// ---------------------------------

async function getAllFoodTrucks() {
  return foodTrucks;
}

async function getFoodTruckById(id) {
  return foodTrucks.find((truck) => truck.id === Number(id));
}

async function getTopRatedFoodTrucks() {
  return foodTrucks.filter((truck) => Number(truck.rating) >= 4.5);
}

async function sortedByPrice() {
  return [...foodTrucks].sort((a, b) => b.price_level - a.price_level);
}

async function getFoodTrucksCount() {
  return { count: foodTrucks.length };
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
  const newTruck = {
    id: foodTrucks.length + 1,
    name,
    current_location,
    daily_special,
    slogan,
    has_vegan_options,
    price_level,
    rating,
  };

  foodTrucks.push(newTruck);
  return newTruck;
}

async function deleteOneFoodTruck(id) {
  const truckIndex = foodTrucks.findIndex((truck) => truck.id === Number(id));

  if (truckIndex === -1) {
    return `No truck found with id ${id}`;
  }

  const deletedTruck = foodTrucks[truckIndex];
  foodTrucks.splice(truckIndex, 1);

  return `Success! Food truck #${id}, ${deletedTruck.name} was deleted!`;
}

async function updateFoodTruckLocation(id, newLocation) {
  const truck = foodTrucks.find((truck) => truck.id === Number(id));

  if (!truck) {
    return null;
  }

  truck.current_location = newLocation;
  return truck;
}

// ---------------------------------
// API Endpoints
// ---------------------------------

app.get("/get-all-food-trucks", async (req, res) => {
  try {
    const trucks = await getAllFoodTrucks();
    res.json(trucks);
  } catch (error) {
    console.error("ERROR IN /get-all-food-trucks:", error);
    res.status(500).json({ error: "Could not get food trucks" });
  }
});

app.get("/get-food-truck-by-id/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const foodTruck = await getFoodTruckById(id);

    if (!foodTruck) {
      return res.status(404).json({ error: "Food truck not found" });
    }

    res.json(foodTruck);
  } catch (error) {
    console.error("ERROR IN /get-food-truck-by-id/:id:", error);
    res.status(500).json({ error: "Could not get food truck" });
  }
});

app.get("/get-top-rated-food-trucks", async (req, res) => {
  try {
    const trucks = await getTopRatedFoodTrucks();
    res.json(trucks);
  } catch (error) {
    console.error("ERROR IN /get-top-rated-food-trucks:", error);
    res.status(500).json({ error: "Could not get top rated food trucks" });
  }
});

app.get("/get-food-trucks-sorted-by-price", async (req, res) => {
  try {
    const sortedFoodTruckPrice = await sortedByPrice();
    res.json(sortedFoodTruckPrice);
  } catch (error) {
    console.error("ERROR IN /get-food-trucks-sorted-by-price:", error);
    res.status(500).json({ error: "Could not sort food trucks by price" });
  }
});

app.get("/get-food-trucks-count", async (req, res) => {
  try {
    const count = await getFoodTrucksCount();
    res.json(count);
  } catch (error) {
    console.error("ERROR IN /get-food-trucks-count:", error);
    res.status(500).json({ error: "Could not get food truck count" });
  }
});

app.post("/add-one-food-truck", async (req, res) => {
  try {
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

    res.json(truck);
  } catch (error) {
    console.error("ERROR IN /add-one-food-truck:", error);
    res.status(500).json({ error: "Could not add food truck" });
  }
});

app.post("/delete-one-food-truck/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await deleteOneFoodTruck(id);
    res.send(result);
  } catch (error) {
    console.error("ERROR IN /delete-one-food-truck/:id:", error);
    res.status(500).json({
      error:
        "There was an issue while deleting the food truck. Please review your request and try again",
    });
  }
});

app.post("/update-food-truck-location", async (req, res) => {
  try {
    const id = req.body.id;
    const newLocation = req.body.newLocation;

    const updatedTruck = await updateFoodTruckLocation(id, newLocation);

    if (!updatedTruck) {
      return res.status(404).json({ error: "Food truck not found" });
    }

    res.send("Success! The food truck location was updated!");
  } catch (error) {
    console.error("ERROR IN /update-food-truck-location:", error);
    res.status(500).json({ error: "Could not update food truck location" });
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});