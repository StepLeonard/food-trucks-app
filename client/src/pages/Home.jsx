import "../App.css";
import { useEffect, useState } from "react";

function Home() {
  const [foodTrucks, setFoodTrucks] = useState([]);
  const [foodTruckCount, setFoodTruckCount] = useState(0);

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

  async function getAllFoodTrucks() {
    const response = await fetch(`${apiUrl}/get-all-food-trucks`);
    const data = await response.json();
    console.log("ALL TRUCKS:", data);
    setFoodTrucks(data);
  }

  async function getFoodTruckCount() {
    const response = await fetch(`${apiUrl}/get-food-trucks-count`);
    const data = await response.json();
    console.log("COUNT:", data);

    setFoodTruckCount(data.count);
  }

  useEffect(() => {
    getAllFoodTrucks();
    getFoodTruckCount();
  }, []);

  return (
    <div className="container">
      <h1>Food Trucks 🚚</h1>

      <h2>
        We have <span className="count">{foodTruckCount}</span> available choices!
      </h2>

      <div className="grid">
        {foodTrucks.map((truck) => (
          <div key={truck.id} className="card">
            <h3>{truck.name}</h3>
            <p>Location: {truck.current_location}</p>
            <p>Daily Special: {truck.daily_special}</p>
            <p>Slogan: {truck.slogan}</p>
            <p>Vegan Options: {truck.has_vegan_options ? "Yes" : "No"}</p>
            <p>Price Level: {truck.price_level}</p>
            <p>Rating: {truck.rating}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;

