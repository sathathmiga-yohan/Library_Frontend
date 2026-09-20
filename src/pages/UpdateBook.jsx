import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function UpdateBook() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    stock: "",
    available: true,
    author_id: "",
    category_id: "",
  });

  useEffect(() => {
    api
      .get(`/books/${id}`)
      .then((response) => {
        setFormData(response.data);
      })
      .catch((error) => {
        console.log(error);
        alert("Book not found");
      });
  }, [id]);

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
      await api.put(`/books/${id}`, bookData);

      alert("Book updated successfully");

      navigate("/books");
    } catch (error) {
      console.log(error);
      alert("Failed to update book");
    }
  };

  return (
    <div className="update-book-page">
      <h1 className="update-book-title">Update Book</h1>

      <form className="update-book-form" onSubmit={handleSubmit}>
        <input
          className="update-book-input"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Book title"
          required
        />

        <br /><br />

        <input
          className="update-book-input"
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price"
          required
        />

        <br /><br />

        <input
          className="update-book-input"
          type="number"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          placeholder="Stock"
          required
        />

        <br /><br />

        <input
          className="update-book-input"
          type="number"
          name="author_id"
          value={formData.author_id}
          onChange={handleChange}
          placeholder="Author ID"
          required
        />

        <br /><br />

        <input
          className="update-book-input"
          type="number"
          name="category_id"
          value={formData.category_id}
          onChange={handleChange}
          placeholder="Category ID"
          required
        />

        <br /><br />

        <button className="update-book-button" type="submit">
          Update Book
        </button>
      </form>
    </div>
  );
}

export default UpdateBook;