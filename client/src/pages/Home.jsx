import "../App.css";
import { useEffect, useState } from "react";

function Home() {
  const [foodTrucks, setFoodTrucks] = useState([]);

  async function getAllFoodTrucks() {
    const response = await fetch("/api/get-all-food-trucks");
    const data = await response.json();
    console.log("DATA:", data);
    setFoodTrucks(data);
  }

  useEffect(() => {
    getAllFoodTrucks();
  }, []);

  return (
    <div className="container">
      <h1>Food Trucks 🚚</h1>

      <div className="grid">
        {foodTrucks.map((truck) => (
          <div className="card" key={truck.id}>
            <h2>{truck.name}</h2>
            <p>{truck.slogan}</p>
            <p>Location: {truck.current_location}</p>
            <p>Price Level: {truck.price_level}</p>
            <p>Rating: {truck.rating}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;