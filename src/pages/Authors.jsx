import { useEffect, useState } from "react";
import api from "../services/api";

function Authors() {
  const [authors, setAuthors] = useState([]);

  // Current logged-in user
  const [user, setUser] = useState(null);

  // Form data
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");

  // Which author is being updated
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
  // GET ALL AUTHORS
  // =========================
  const getAuthors = () => {
    api
      .get("/authors/")
      .then((response) => {
        setAuthors(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Page load
  useEffect(() => {
    getCurrentUser();
    getAuthors();
  }, []);

  // =========================
  // ADD OR UPDATE AUTHOR
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const authorData = {
      name: name,
      email: email,
      country: country,
    };

    try {
      if (editId !== null) {
        await api.put(`/authors/${editId}`, authorData);

        alert("Author updated successfully");
      } else {
        await api.post("/authors/", authorData);

        alert("Author added successfully");
      }

      setName("");
      setEmail("");
      setCountry("");
      setEditId(null);

      getAuthors();
    } catch (error) {
      console.log(error);
      alert("Operation failed");
    }
  };

  // =========================
  // EDIT AUTHOR
  // =========================
  const editAuthor = (author) => {
    setEditId(author.id);

    setName(author.name);
    setEmail(author.email);
    setCountry(author.country);
  };

  // =========================
  // DELETE AUTHOR
  // =========================
  const deleteAuthor = async (authorId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this author?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await api.delete(`/authors/${authorId}`);

      alert("Author deleted successfully");

      getAuthors();
    } catch (error) {
      console.log(error);
      alert("Failed to delete author");
    }
  };

  // =========================
  // CANCEL UPDATE
  // =========================
  const cancelEdit = () => {
    setEditId(null);

    setName("");
    setEmail("");
    setCountry("");
  };

  return (
    <div className="authors-page">
      <h1 className="authors-title">Authors</h1>

      {/* ADD / UPDATE FORM */}
      <form className="authors-form" onSubmit={handleSubmit}>
        <input
          className="authors-input"
          type="text"
          placeholder="Author Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          className="authors-input"
          type="email"
          placeholder="Author Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="authors-input"
          type="text"
          placeholder="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
        />

        <button className="authors-submit-button" type="submit">
          {editId !== null ? "Update Author" : "Add Author"}
        </button>

        {editId !== null && (
          <button
            className="authors-cancel-button"
            type="button"
            onClick={cancelEdit}
          >
            Cancel
          </button>
        )}
      </form>

      <br />

      {/* AUTHORS TABLE */}
      {authors.length === 0 ? (
        <p className="authors-empty">No authors found</p>
      ) : (
        <table className="authors-table" border="1" cellPadding="10">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Country</th>
              <th>Update</th>

              {user?.role === "admin" && (
                <th>Delete</th>
              )}
            </tr>
          </thead>

          <tbody>
            {authors.map((author) => (
              <tr key={author.id}>
                <td>{author.id}</td>
                <td>{author.name}</td>
                <td>{author.email}</td>
                <td>{author.country}</td>

                <td>
                  <button
                    className="authors-update-button"
                    onClick={() => editAuthor(author)}
                  >
                    Update
                  </button>
                </td>

                {user?.role === "admin" && (
                  <td>
                    <button
                      className="authors-delete-button"
                      onClick={() => deleteAuthor(author.id)}
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

export default Authors;