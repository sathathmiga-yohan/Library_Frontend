import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AddBook() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    stock: "",
    available: true,
    author_id: "",
    category_id: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const bookData = {
      title: formData.title,
      price: Number(formData.price),
      stock: Number(formData.stock),
      available: formData.available,
      author_id: Number(formData.author_id),
      category_id: Number(formData.category_id),
    };

    try {
      await api.post("/books/", bookData);

      alert("Book added successfully");

      navigate("/books");
    } catch (error) {
      console.log(error);
      alert("Failed to add book");
    }
  };

  return (
    <div className="add-book-page">
      <h1 className="add-book-title">Add Book</h1>

      <form className="add-book-form" onSubmit={handleSubmit}>
        <input
          className="add-book-input"
          type="text"
          name="title"
          placeholder="Book title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <br /><br />

        <input
          className="add-book-input"
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
        />

        <br /><br />

        <input
          className="add-book-input"
          type="number"
          name="stock"
          placeholder="Stock"
          value={formData.stock}
          onChange={handleChange}
          required
        />

        <br /><br />

        <input
          className="add-book-input"
          type="number"
          name="author_id"
          placeholder="Author ID"
          value={formData.author_id}
          onChange={handleChange}
          required
        />

        <br /><br />

        <input
          className="add-book-input"
          type="number"
          name="category_id"
          placeholder="Category ID"
          value={formData.category_id}
          onChange={handleChange}
          required
        />

        <br /><br />

        <button className="add-book-button" type="submit">
          Add Book
        </button>
      </form>
    </div>
  );
}

export default AddBook;