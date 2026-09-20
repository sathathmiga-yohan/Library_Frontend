import { useEffect, useState } from "react";
import api from "../services/api";

function Categories() {
  const [categories, setCategories] = useState([]);

  // Current logged-in user
  const [user, setUser] = useState(null);

  // Form data
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Update category ID
  const [editId, setEditId] = useState(null);

  // =========================
  // GET CURRENT USER
  // =========================
  const getCurrentUser = async () => {
    try {
      const response = await api.get("/auth/me");
      setUser(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // =========================
  // GET ALL CATEGORIES
  // =========================
  const getCategories = () => {
    api
      .get("/categories/")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Page load
  useEffect(() => {
    getCurrentUser();
    getCategories();
  }, []);

  // =========================
  // ADD OR UPDATE CATEGORY
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const categoryData = {
      name: name,
      description: description,
    };

    try {
      // UPDATE
      if (editId !== null) {
        await api.put(`/categories/${editId}`, categoryData);

        alert("Category updated successfully");
      }

      // ADD
      else {
        await api.post("/categories/", categoryData);

        alert("Category added successfully");
      }

      // Clear form
      setName("");
      setDescription("");
      setEditId(null);

      // Reload categories
      getCategories();
    } catch (error) {
      console.log(error);

      const message =
        error.response?.data?.detail || "Operation failed";

      alert(message);
    }
  };

  // =========================
  // EDIT CATEGORY
  // =========================
  const editCategory = (category) => {
    setEditId(category.id);

    setName(category.name);
    setDescription(category.description || "");
  };

  // =========================
  // DELETE CATEGORY
  // =========================
  const deleteCategory = async (categoryId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await api.delete(`/categories/${categoryId}`);

      alert("Category deleted successfully");

      getCategories();
    } catch (error) {
      console.log(error);

      const message =
        error.response?.data?.detail ||
        "Failed to delete category";

      alert(message);
    }
  };

  // =========================
  // CANCEL UPDATE
  // =========================
  const cancelEdit = () => {
    setEditId(null);
    setName("");
    setDescription("");
  };

  return (
    <div className="categories-page">
      <h1 className="categories-title">Categories</h1>

      {/* ADD / UPDATE FORM */}
      <form className="categories-form" onSubmit={handleSubmit}>
        <input
          className="categories-input"
          type="text"
          placeholder="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          className="categories-input"
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button className="categories-submit-button" type="submit">
          {editId !== null
            ? "Update Category"
            : "Add Category"}
        </button>

        {editId !== null && (
          <button
            className="categories-cancel-button"
            type="button"
            onClick={cancelEdit}
          >
            Cancel
          </button>
        )}
      </form>

      <br />

      {/* CATEGORIES TABLE */}
      {categories.length === 0 ? (
        <p className="categories-empty">No categories found</p>
      ) : (
        <table
          className="categories-table"
          border="1"
          cellPadding="10"
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Update</th>

              {/* ADMIN ONLY */}
              {user?.role === "admin" && (
                <th>Delete</th>
              )}
            </tr>
          </thead>

          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td>{category.id}</td>
                <td>{category.name}</td>
                <td>{category.description}</td>

                <td>
                  <button
                    className="categories-update-button"
                    onClick={() =>
                      editCategory(category)
                    }
                  >
                    Update
                  </button>
                </td>

                {/* ADMIN ONLY */}
                {user?.role === "admin" && (
                  <td>
                    <button
                      className="categories-delete-button"
                      onClick={() =>
                        deleteCategory(category.id)
                      }
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Categories;