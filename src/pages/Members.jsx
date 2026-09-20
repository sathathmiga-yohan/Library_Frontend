import { useEffect, useState } from "react";
import api from "../services/api";

function Members() {
  const [members, setMembers] = useState([]);

  // Current logged-in user
  const [user, setUser] = useState(null);

  // Form data
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [active, setActive] = useState(true);

  // Update member ID
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
  // GET ALL MEMBERS
  // =========================
  const getMembers = () => {
    api
      .get("/members/")
      .then((response) => {
        setMembers(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Page load
  useEffect(() => {
    getCurrentUser();
    getMembers();
  }, []);

  // =========================
  // ADD OR UPDATE MEMBER
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const memberData = {
      name: name,
      email: email,
      phone: phone || null,
      active: active,
    };

    try {
      // UPDATE
      if (editId !== null) {
        await api.put(`/members/${editId}`, memberData);

        alert("Member updated successfully");
      }

      // ADD
      else {
        await api.post("/members/", memberData);

        alert("Member added successfully");
      }

      clearForm();
      getMembers();
    } catch (error) {
      console.log(error);

      const message =
        error.response?.data?.detail || "Operation failed";

      alert(message);
    }
  };

  // =========================
  // EDIT MEMBER
  // =========================
  const editMember = (member) => {
    setEditId(member.id);

    setName(member.name);
    setEmail(member.email);
    setPhone(member.phone || "");
    setActive(member.active);
  };

  // =========================
  // DELETE MEMBER
  // =========================
  const deleteMember = async (memberId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this member?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await api.delete(`/members/${memberId}`);

      alert("Member deleted successfully");

      getMembers();
    } catch (error) {
      console.log(error);

      const message =
        error.response?.data?.detail ||
        "Failed to delete member";

      alert(message);
    }
  };

  // =========================
  // CLEAR FORM
  // =========================
  const clearForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setActive(true);
    setEditId(null);
  };

  return (
    <div className="members-page">
      <h1 className="members-title">Members</h1>

      {/* ADD / UPDATE FORM */}
      <form className="members-form" onSubmit={handleSubmit}>
        <input
          className="members-input"
          type="text"
          placeholder="Member Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          className="members-input"
          type="email"
          placeholder="Member Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="members-input"
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <select
          className="members-select"
          value={active}
          onChange={(e) =>
            setActive(e.target.value === "true")
          }
        >
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>

        <button className="members-submit-button" type="submit">
          {editId !== null
            ? "Update Member"
            : "Add Member"}
        </button>

        {editId !== null && (
          <button
            className="members-cancel-button"
            type="button"
            onClick={clearForm}
          >
            Cancel
          </button>
        )}
      </form>

      <br />

      {/* MEMBERS TABLE */}
      {members.length === 0 ? (
        <p className="members-empty">No members found</p>
      ) : (
        <table
          className="members-table"
          border="1"
          cellPadding="10"
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Active</th>
              <th>Created At</th>
              <th>Update</th>

              {/* ADMIN ONLY */}
              {user?.role === "admin" && (
                <th>Delete</th>
              )}
            </tr>
          </thead>

          <tbody>
            {members.map((member) => (
              <tr key={member.id}>
                <td>{member.id}</td>
                <td>{member.name}</td>
                <td>{member.email}</td>
                <td>{member.phone || "-"}</td>
                <td>
                  {member.active ? "Yes" : "No"}
                </td>
                <td>{member.created_at}</td>

                <td>
                  <button
                    className="members-update-button"
                    onClick={() =>
                      editMember(member)
                    }
                  >
                    Update
                  </button>
                </td>

                {/* ADMIN ONLY */}
                {user?.role === "admin" && (
                  <td>
                    <button
                      className="members-delete-button"
                      onClick={() =>
                        deleteMember(member.id)
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

export default Members;