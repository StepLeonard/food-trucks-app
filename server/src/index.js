import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

// ---------------------------------
// Fake Data
// ---------------------------------

let foodTrucks = [
  {
    id: 1,
    name: "Taco Fiesta",
    current_location: "Downtown",
    daily_special: "Street Tacos",
    slogan: "Fresh and fast",
    has_vegan_options: true,
    price_level: 2,
    rating: 4.7,
  },
  {
    id: 2,
    name: "Burger Bus",
    current_location: "Main Street",
    daily_special: "Double Cheeseburger",
    slogan: "Burgers on wheels",
    has_vegan_options: false,
    price_level: 3,
    rating: 4.5,
  },
  {
    id: 3,
    name: "Green Machine",
    current_location: "Summerlin",
    daily_special: "Vegan Burrito",
    slogan: "Fresh fuel on wheels",
    has_vegan_options: true,
    price_level: 1,
    rating: 4.2,
  },
  {
    id: 4,
    name: "Pizza Wagon",
    current_location: "Henderson",
    daily_special: "Pepperoni Slice",
    slogan: "Rolling with flavor",
    has_vegan_options: false,
    price_level: 4,
    rating: 4.8,
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

async function getVeganFoodTrucks() {
  return foodTrucks.filter((truck) => truck.has_vegan_options === true);
}

async function getFoodTrucksByPrice(price) {
  return foodTrucks.filter(
    (truck) => Number(truck.price_level) === Number(price)
  );
}

async function getTopRatedFoodTrucks() {
  return foodTrucks.filter((truck) => Number(truck.rating) >= 4.5);
}

async function getFoodTrucksSortedByRating() {
  return [...foodTrucks].sort((a, b) => Number(b.rating) - Number(a.rating));
}

async function getFoodTrucksSortedByPrice() {
  return [...foodTrucks].sort(
    (a, b) => Number(b.price_level) - Number(a.price_level)
  );
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

// 1. GET /get-all-food-trucks
app.get("/get-all-food-trucks", async (req, res) => {
  try {
    const trucks = await getAllFoodTrucks();
    res.json(trucks);
  } catch (error) {
    console.error("ERROR IN /get-all-food-trucks:", error);
    res.status(500).json({ error: "Could not get food trucks" });
  }
});

// 2. GET /get-food-truck-by-id/:id
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

// 3. GET /get-vegan-food-trucks
app.get("/get-vegan-food-trucks", async (req, res) => {
  try {
    const trucks = await getVeganFoodTrucks();
    res.json(trucks);
  } catch (error) {
    console.error("ERROR IN /get-vegan-food-trucks:", error);
    res.status(500).json({ error: "Could not get vegan food trucks" });
  }
});

// 4. GET /get-food-trucks-by-price/:price
app.get("/get-food-trucks-by-price/:price", async (req, res) => {
  try {
    const price = req.params.price;
    const trucks = await getFoodTrucksByPrice(price);
    res.json(trucks);
  } catch (error) {
    console.error("ERROR IN /get-food-trucks-by-price/:price:", error);
    res.status(500).json({ error: "Could not get food trucks by price" });
  }
});

// 5. GET /get-top-rated-food-trucks
app.get("/get-top-rated-food-trucks", async (req, res) => {
  try {
    const trucks = await getTopRatedFoodTrucks();
    res.json(trucks);
  } catch (error) {
    console.error("ERROR IN /get-top-rated-food-trucks:", error);
    res.status(500).json({ error: "Could not get top rated food trucks" });
  }
});

// 6. GET /get-food-trucks-sorted-by-rating
app.get("/get-food-trucks-sorted-by-rating", async (req, res) => {
  try {
    const trucks = await getFoodTrucksSortedByRating();
    res.json(trucks);
  } catch (error) {
    console.error("ERROR IN /get-food-trucks-sorted-by-rating:", error);
    res.status(500).json({ error: "Could not sort food trucks by rating" });
  }
});

// 7. GET /get-food-trucks-sorted-by-price
app.get("/get-food-trucks-sorted-by-price", async (req, res) => {
  try {
    const trucks = await getFoodTrucksSortedByPrice();
    res.json(trucks);
  } catch (error) {
    console.error("ERROR IN /get-food-trucks-sorted-by-price:", error);
    res.status(500).json({ error: "Could not sort food trucks by price" });
  }
});

// 8. GET /get-food-trucks-count
app.get("/get-food-trucks-count", async (req, res) => {
  try {
    const count = await getFoodTrucksCount();
    res.json(count);
  } catch (error) {
    console.error("ERROR IN /get-food-trucks-count:", error);
    res.status(500).json({ error: "Could not get food truck count" });
  }
});

// 9. POST /add-one-food-truck
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

// 10. POST /update-food-truck-location
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