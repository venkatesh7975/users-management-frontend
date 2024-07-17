import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [input, setInput] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}`);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingUser) {
      try {
        const response = await axios.put(
          `${process.env.REACT_APP_API_URL}/${editingUser._id}`,
          { username }
        );
        setUsers(
          users.map((user) =>
            user._id === editingUser._id ? response.data : user
          )
        );
        setEditingUser(null);
        setUsername("");
      } catch (error) {
        console.error("Error updating user:", error);
      }
    } else {
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}`, {
          username,
        });
        setUsers([...users, response.data]);
        setUsername("");
      } catch (error) {
        console.error("Error adding user:", error);
      }
    }
  };

  const onEdit = (user) => {
    setEditingUser(user);
    setUsername(user.username);
  };

  const onDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/${id}`);
      setUsers(users.filter((user) => user._id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const filterUsers = users.filter((user) => {
    return user.username.toLowerCase().includes(input.toLowerCase());
  });

  return (
    <div className="App">
      <header className="App-header text-center py-4 bg-primary text-white">
        <h1>User Management App</h1>
      </header>
      <main className="container my-4">
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
            <div className="input-group-append">
              <button type="submit" className="btn btn-primary">
                {editingUser ? "Update User" : "Add User"}
              </button>
            </div>
          </div>
        </form>
        <input
          type="text"
          placeholder="search"
          onChange={(e) => {
            setInput(e.target.value);
          }}
        />
        <div>
          <h2>User List</h2>
          <ul className="list-group">
            {filterUsers.map((user) => (
              <li
                key={user._id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                {user.username}
                <div>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => onEdit(user)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => onDelete(user._id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default App;
