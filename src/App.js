import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

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

  return (
    <div className="App">
      <header className="App-header">
        <h1>User Management App</h1>
      </header>
      <main>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            required
          />
          <button type="submit">
            {editingUser ? "Update User" : "Add User"}
          </button>
        </form>
        <div>
          <h2>User List</h2>
          <ul>
            {users.map((user) => (
              <div key={user._id}>
                <li>{user.username}</li>
                <button onClick={() => onEdit(user)}>Edit</button>
                <button onClick={() => onDelete(user._id)}>Delete</button>
              </div>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default App;
