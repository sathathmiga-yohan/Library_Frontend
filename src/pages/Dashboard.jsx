import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

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

  useEffect(() => {
    getCurrentUser();
  }, []);

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    // Remove JWT token
    localStorage.removeItem("token");

    // Go back to login page
    navigate("/");
  };

  if (user === null) {
    return <p>Loading user...</p>;
  }

  return (
    <div className="dashboard-page">
      <h1 className="dashboard-title">Library Dashboard</h1>

      <p className="dashboard-welcome">
        Welcome, <strong>{user.full_name}</strong>
      </p>

      <p className="dashboard-role">
        Role: <strong>{user.role}</strong>
      </p>

      <hr className="dashboard-line" />

      <h2 className="dashboard-menu-title">Menu</h2>

      {/* ALL USERS */}
      <button
        className="dashboard-button"
        onClick={() => navigate("/books")}
      >
        Books
      </button>

      {/* ADMIN + LIBRARIAN */}
      {(user.role === "admin" || user.role === "librarian") && (
        <>
          <button
            className="dashboard-button"
            onClick={() => navigate("/authors")}
          >
            Authors
          </button>

          <button
            className="dashboard-button"
            onClick={() => navigate("/categories")}
          >
            Categories
          </button>

          <button
            className="dashboard-button"
            onClick={() => navigate("/members")}
          >
            Members
          </button>

          <button
            className="dashboard-button"
            onClick={() => navigate("/borrows")}
          >
            Borrows
          </button>

          <button
            className="dashboard-button"
            onClick={() => navigate("/statistics")}
          >
            Statistics
          </button>
        </>
      )}

      <br />
      <br />

      {/* LOGOUT */}
      <button
        className="logout-button"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
}

export default Dashboard;