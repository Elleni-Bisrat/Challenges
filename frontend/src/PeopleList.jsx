import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function PeopleList() {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const response = await fetch(
          "https://addandremove.infinityfreeapp.com/challenges/backend/api.php?action=get_people"
        );
        const data = await response.json();
        setPeople(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch people");
        setLoading(false);
      }
    };

    fetchPeople();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        "http://localhost/AddAndRemove/backend/api.php",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "delete_person",
            id: id,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setPeople((prev) => prev.filter((person) => person.id !== id));
      } else {
        setError(data.message || "Failed to delete person");
      }
    } catch (err) {
      setError("Failed to connect to server");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="ml-10">
      <h2 className="text-2xl font-bold p-2">People List</h2>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {people.map((person) => (
          <div
            key={person.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              width: "200px",
            }}
          >
            {person.image_path && (
              <img
                src={`http://localhost/AddAndRemove/backend/${person.image_path}`}
                alt={person.name}
                style={{ width: "100%", height: "auto" }}
              />
            )}
            <h3>{person.name}</h3>
            <p>Email: {person.email}</p>
            <p>Phone: {person.phone}</p>
            <button
              onClick={() => handleDelete(person.id)}
              style={{ backgroundColor: "darkred", color: "white", padding:"6px" ,margin:"1rem"}}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={() => navigate("/add-person")}
        className="bg-blue-300 p-2 mt-4"
      >
        Add New Person
      </button>
    </div>
  );
}

export default PeopleList;
