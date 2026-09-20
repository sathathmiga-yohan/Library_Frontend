import { useEffect, useState } from "react";
import api from "../services/api";

function Statistics() {
  const [stats, setStats] = useState(null);

  // =========================
  // GET LIBRARY STATISTICS
  // =========================
  const getStatistics = async () => {
    try {
      const response = await api.get("/borrows/library-stats");

      setStats(response.data);
    } catch (error) {
      console.log(error);

      const message =
        error.response?.data?.detail ||
        "Failed to load library statistics";

      alert(message);
    }
  };

  // Page load
  useEffect(() => {
    getStatistics();
  }, []);

  return (
    <div className="statistics-page">
      <h1 className="statistics-title">Library Statistics</h1>

      {stats === null ? (
        <p className="statistics-loading">Loading statistics...</p>
      ) : (
        <div className="statistics-container">
          <p className="statistics-item">
            <strong>Total Books:</strong> {stats.total_books}
          </p>

          <p className="statistics-item">
            <strong>Total Stock:</strong> {stats.total_stock}
          </p>

          <p className="statistics-item">
            <strong>Total Authors:</strong> {stats.total_authors}
          </p>

          <p className="statistics-item">
            <strong>Total Categories:</strong> {stats.total_categories}
          </p>

          <p className="statistics-item">
            <strong>Total Members:</strong> {stats.total_members}
          </p>

          <p className="statistics-item">
            <strong>Available Books:</strong> {stats.available_books}
          </p>

          <p className="statistics-item">
            <strong>Unavailable Books:</strong> {stats.unavailable_books}
          </p>

          <p className="statistics-item">
            <strong>Currently Borrowed Books:</strong>{" "}
            {stats.currently_borrowed_books}
          </p>

          <p className="statistics-item">
            <strong>Returned Books:</strong> {stats.returned_books}
          </p>

          <p className="statistics-item">
            <strong>Overdue Books:</strong> {stats.overdue_books}
          </p>

          <button
            className="statistics-refresh-button"
            onClick={getStatistics}
          >
            Refresh Statistics
          </button>
        </div>
      )}
    </div>
  );
}

export default Statistics;