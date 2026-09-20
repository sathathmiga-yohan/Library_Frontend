import { useEffect, useState } from "react";
import api from "../services/api";

function Borrows() {
  const [borrows, setBorrows] = useState([]);

  // Borrow form data
  const [memberId, setMemberId] = useState("");
  const [bookId, setBookId] = useState("");
  const [dueDate, setDueDate] = useState("");

  // History search
  const [historyMemberId, setHistoryMemberId] = useState("");
  const [historyBookId, setHistoryBookId] = useState("");

  // =========================
  // GET ALL BORROW RECORDS
  // =========================
  const getBorrows = () => {
    api
      .get("/borrows/")
      .then((response) => {
        setBorrows(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Page load
  useEffect(() => {
    getBorrows();
  }, []);

  // =========================
  // BORROW A BOOK
  // =========================
  const borrowBook = async (e) => {
    e.preventDefault();

    const borrowData = {
      member_id: Number(memberId),
      book_id: Number(bookId),
      due_date: dueDate,
    };

    try {
      await api.post("/borrows/", borrowData);

      alert("Book borrowed successfully");

      setMemberId("");
      setBookId("");
      setDueDate("");

      getBorrows();
    } catch (error) {
      console.log(error);

      const message =
        error.response?.data?.detail || "Failed to borrow book";

      alert(message);
    }
  };

  // =========================
  // RETURN BOOK
  // =========================
  const returnBook = async (borrowId) => {
    const confirmReturn = window.confirm(
      "Are you sure you want to return this book?"
    );

    if (!confirmReturn) {
      return;
    }

    try {
      await api.put(`/borrows/${borrowId}/return`);

      alert("Book returned successfully");

      getBorrows();
    } catch (error) {
      console.log(error);

      const message =
        error.response?.data?.detail || "Failed to return book";

      alert(message);
    }
  };

  // =========================
  // MEMBER BORROW HISTORY
  // =========================
  const getMemberHistory = async () => {
    if (!historyMemberId) {
      alert("Enter Member ID");
      return;
    }

    try {
      const response = await api.get(
        `/borrows/member/${historyMemberId}`
      );

      setBorrows(response.data);
    } catch (error) {
      console.log(error);

      const message =
        error.response?.data?.detail ||
        "Failed to get member history";

      alert(message);
    }
  };

  // =========================
  // BOOK BORROW HISTORY
  // =========================
  const getBookHistory = async () => {
    if (!historyBookId) {
      alert("Enter Book ID");
      return;
    }

    try {
      const response = await api.get(
        `/borrows/book/${historyBookId}`
      );

      setBorrows(response.data);
    } catch (error) {
      console.log(error);

      const message =
        error.response?.data?.detail ||
        "Failed to get book history";

      alert(message);
    }
  };

  // =========================
  // GET OVERDUE BOOKS
  // =========================
  const getOverdueBooks = async () => {
    try {
      const response = await api.get("/borrows/overdue");

      setBorrows(response.data);
    } catch (error) {
      console.log(error);

      const message =
        error.response?.data?.detail ||
        "Failed to get overdue books";

      alert(message);
    }
  };

  // =========================
  // SHOW ALL RECORDS
  // =========================
  const showAllBorrows = () => {
    setHistoryMemberId("");
    setHistoryBookId("");

    getBorrows();
  };

  return (
    <div className="borrows-page">
      <h1 className="borrows-title">Borrow Books</h1>

      {/* BORROW FORM */}
      <form className="borrows-form" onSubmit={borrowBook}>
        <input
          className="borrows-input"
          type="number"
          placeholder="Member ID"
          value={memberId}
          onChange={(e) => setMemberId(e.target.value)}
          required
        />

        <input
          className="borrows-input"
          type="number"
          placeholder="Book ID"
          value={bookId}
          onChange={(e) => setBookId(e.target.value)}
          required
        />

        <input
          className="borrows-input"
          type="datetime-local"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />

        <button className="borrows-submit-button" type="submit">
          Borrow Book
        </button>
      </form>

      <br />

      {/* MEMBER HISTORY */}
      <h2 className="borrows-subtitle">Member Borrow History</h2>

      <input
        className="borrows-input"
        type="number"
        placeholder="Member ID"
        value={historyMemberId}
        onChange={(e) => setHistoryMemberId(e.target.value)}
      />

      <button
        className="borrows-history-button"
        onClick={getMemberHistory}
      >
        Get Member History
      </button>

      <br />
      <br />

      {/* BOOK HISTORY */}
      <h2 className="borrows-subtitle">Book Borrow History</h2>

      <input
        className="borrows-input"
        type="number"
        placeholder="Book ID"
        value={historyBookId}
        onChange={(e) => setHistoryBookId(e.target.value)}
      />

      <button
        className="borrows-history-button"
        onClick={getBookHistory}
      >
        Get Book History
      </button>

      <br />
      <br />

      {/* OVERDUE */}
      <button
        className="borrows-overdue-button"
        onClick={getOverdueBooks}
      >
        Show Overdue Books
      </button>

      <button
        className="borrows-all-button"
        onClick={showAllBorrows}
      >
        Show All Borrow Records
      </button>

      <br />
      <br />

      <h2 className="borrows-subtitle">Borrow Records</h2>

      {/* BORROW RECORDS TABLE */}
      {borrows.length === 0 ? (
        <p className="borrows-empty">No borrow records found</p>
      ) : (
        <table
          className="borrows-table"
          border="1"
          cellPadding="10"
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Member ID</th>
              <th>Book ID</th>
              <th>Borrow Date</th>
              <th>Due Date</th>
              <th>Return Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {borrows.map((borrow) => (
              <tr key={borrow.id}>
                <td>{borrow.id}</td>
                <td>{borrow.member_id}</td>
                <td>{borrow.book_id}</td>
                <td>{borrow.borrow_date}</td>
                <td>{borrow.due_date}</td>

                <td>
                  {borrow.return_date
                    ? borrow.return_date
                    : "-"}
                </td>

                <td>{borrow.status}</td>

                <td>
                  {borrow.status === "Borrowed" ? (
                    <button
                      className="borrows-return-button"
                      onClick={() => returnBook(borrow.id)}
                    >
                      Return
                    </button>
                  ) : (
                    "Returned"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Borrows;