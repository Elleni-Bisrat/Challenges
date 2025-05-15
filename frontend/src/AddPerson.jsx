import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddPerson() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    image: null,
    preview: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          image: reader.result,
          preview: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(
        "https://addandremove.infinityfreeapp.com/backend/api.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "add_person",
            ...formData,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setMessage("Person added successfully!");
        navigate("/people-list");
      } else {
        setMessage(data.message || "Failed to add person");
      }
    } catch (err) {
      setMessage("Failed to connect to server");
    }
  };

  return (
    <div className="flex flex-col text-center align-center p-10 ">
      <h2 className="text-2xl p-2">Add New Person</h2>
      <form onSubmit={handleSubmit} className="p-2 text-lg flex flex-col gap-4">
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="bg-gray-300 text-black"
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="bg-gray-300"
          />
        </div>
        <div>
          <label>Phone:</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="bg-gray-300"
          />
        </div>
        <div>
          <label className="ml-24">Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="bg-blue-400"
          />
          {formData.preview && (
            <img
              src={formData.preview}
              alt="Preview"
              style={{ width: "100px", height: "100px" ,marginLeft:"24rem"}}
            />
          )}
        </div>
        <div>
          <button type="submit" className="bg-blue-300 p-2 px-20 m-4 ">
            Add
          </button>
        </div>
      </form>
      {message && <p>{message}</p>}
      <div>
        <button
        onClick={() => navigate("/people-list")}
        className="bg-blue-300 p-2 px-10 "
      >
        View People List
      </button>
      </div>
    </div>
  );
}

export default AddPerson;
