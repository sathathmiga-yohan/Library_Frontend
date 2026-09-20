import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Books() {
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [user, setUser] = useState(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [available, setAvailable] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [order, setOrder] = useState("asc");

  // Pagination
  const [page, setPage] = useState(1);
  const limit = 5;

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
  // GET BOOKS
  // =========================
  const getBooks = (
    searchValue = search,
    categoryValue = category,
    pageValue = page
  ) => {
    const params = {};

    params.skip = (pageValue - 1) * limit;
    params.limit = limit;

    if (searchValue) {
      params.search = searchValue;
    }

    if (categoryValue) {
      params.category = categoryValue;
    }

    if (minPrice) {
      params.min_price = Number(minPrice);
    }

    if (maxPrice) {
      params.max_price = Number(maxPrice);
    }

    if (authorId) {
      params.author_id = Number(authorId);
    }

    if (sortBy) {
      params.sort_by = sortBy;
      params.order = order;
    }

    if (available !== "") {
      params.available = available;
    }

    api
      .get("/books/", { params })
      .then((response) => {
        setBooks(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Page load / page change
  useEffect(() => {
    getCurrentUser();
    getBooks(search, category, page);
  }, [page]);

  // =========================
  // SEARCH / FILTER
  // =========================
  const handleFilter = () => {
    if (page !== 1) {
      setPage(1);
    } else {
      getBooks(search, category, 1);
    }
  };

  // =========================
  // CLEAR FILTER
  // =========================
  const clearFilter = () => {
    setSearch("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setAvailable("");
    setAuthorId("");
    setSortBy("");
    setOrder("asc");
    setPage(1);

    api
      .get("/books/", {
        params: {
          skip: 0,
          limit: limit,
        },
      })
      .then((response) => {
        setBooks(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // =========================
  // UPDATE STOCK
  // =========================
  const updateStock = async (bookId) => {
    const newStock = prompt("Enter new stock quantity:");

    if (newStock === null) {
      return;
    }

    if (newStock === "" || Number(newStock) < 0) {
      alert("Stock must be 0 or more");
      return;
    }

    try {
      await api.patch(`/books/${bookId}/stock`, {
        stock: Number(newStock),
      });

      alert("Stock updated successfully");

      getBooks();
    } catch (error) {
      console.log(error);
      alert("Failed to update stock");
    }
  };

  // =========================
  // DELETE BOOK
  // =========================
  const deleteBook = async (bookId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this book?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await api.delete(`/books/${bookId}`);

      alert("Book deleted successfully");

      getBooks();
    } catch (error) {
      console.log(error);
      alert("Failed to delete book");
    }
  };

  // =========================
  // PAGINATION
  // =========================
  const previousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const nextPage = () => {
    if (books.length === limit) {
      setPage(page + 1);
    }
  };

  return (
    <div className="books-page">
      <h1 className="books-title">Books</h1>

      {/* Search */}
      <input
        className="books-input"
        type="text"
        placeholder="Search book title"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Category */}
      <input
        className="books-input"
        type="text"
        placeholder="Category Name"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />

      {/* Minimum Price */}
      <input
        className="books-input"
        type="number"
        placeholder="Min Price"
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
      />

      {/* Maximum Price */}
      <input
        className="books-input"
        type="number"
        placeholder="Max Price"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
      />

      {/* Author */}
      <input
        className="books-input"
        type="number"
        placeholder="Author ID"
        value={authorId}
        onChange={(e) => setAuthorId(e.target.value)}
      />

      {/* Availability */}
      <select
        className="books-select"
        value={available}
        onChange={(e) => setAvailable(e.target.value)}
      >
        <option value="">All Availability</option>
        <option value="true">Available</option>
        <option value="false">Unavailable</option>
      </select>

      {/* Sort */}
      <select
        className="books-select"
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
      >
        <option value="">Sort By</option>
        <option value="price">Price</option>
        <option value="title">Title</option>
      </select>

      {/* Order */}
      <select
        className="books-select"
        value={order}
        onChange={(e) => setOrder(e.target.value)}
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>

      <button className="books-filter-button" onClick={handleFilter}>
        Search / Filter
      </button>

      <button className="books-clear-button" onClick={clearFilter}>
        Clear
      </button>

      <br />
      <br />

      {books.length === 0 ? (
        <p className="books-empty">No books found</p>
      ) : (
        <>
          <table className="books-table" border="1" cellPadding="10">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Available</th>
                <th>Author ID</th>
                <th>Category ID</th>

                {user?.role !== "member" && (
                  <>
                    <th>Update</th>
                    <th>Stock Action</th>
                  </>
                )}

                {user?.role === "admin" && <th>Delete</th>}
              </tr>
            </thead>

            <tbody>
              {books.map((book) => (
                <tr key={book.id}>
                  <td>{book.id}</td>
                  <td>{book.title}</td>
                  <td>{book.price}</td>
                  <td>{book.stock}</td>
                  <td>{book.available ? "Yes" : "No"}</td>
                  <td>{book.author_id}</td>
                  <td>{book.category_id}</td>

                  {user?.role !== "member" && (
                    <>
                      <td>
                        <button
                          className="books-update-button"
                          onClick={() =>
                            navigate(`/update-book/${book.id}`)
                          }
                        >
                          Update
                        </button>
                      </td>

                      <td>
                        <button
                          className="books-stock-button"
                          onClick={() => updateStock(book.id)}
                        >
                          Update Stock
                        </button>
                      </td>
                    </>
                  )}

                  {user?.role === "admin" && (
                    <td>
                      <button
                        className="books-delete-button"
                        onClick={() => deleteBook(book.id)}
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          <br />

          <button
            className="books-page-button"
            onClick={previousPage}
            disabled={page === 1}
          >
            Previous
          </button>

          <span className="books-page-number"> Page {page} </span>

          <button
            className="books-page-button"
            onClick={nextPage}
            disabled={books.length < limit}
          >
            Next
          </button>
        </>
      )}
    </div>
  );
}

export default Books;