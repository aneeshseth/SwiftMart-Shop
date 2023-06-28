import React, { useEffect, useState } from "react";
import "./UserDB.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function UserDB() {
  const [users, setUsers] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const getUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3600/ecom/users");
      const data = res.data;
      setUsers(data);
    } catch (error) {
      console.log(error);
    }
  };
  const Logout = async () => {
    try {
      await axios.get("http://localhost:3600/ecom/logoutUser");
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };
  const checkRole = async (id) => {
    try {
      const res = await axios.get(`http://localhost:3600/ecom/role/${id}`);
      if (res.data !== "admin") {
        Logout();
      }
    } catch (err) {
      Logout();
      navigate("/");
    }
  };

  useEffect(() => {
    getUsers();
    checkRole(id);
  }, []);

  const handleDelete = async (id) => {
    const res = await axios.delete(
      `http://localhost:3600/ecom/user/delete/${id}`
    );
    const data = await res.data;
    return data;
  };
  const onlyUsers = async () => {
    const res = await axios.get("http://localhost:3600/ecom/onlyUsers");
    const data = await res.data;
    return data;
  };
  const onlyAdmin = async () => {
    const res = await axios.get("http://localhost:3600/ecom/onlyAdmin");
    const data = await res.data;
    return data;
  };

  return (
    <div className="admin-home">
      <h1>User/Admin List:</h1>
      <button
        className="users"
        onClick={() => {
          onlyUsers().then((data) => {
            setUsers(data);
          });
        }}
      >
        Only Users List
      </button>
      <button
        className="filters"
        onClick={() => {
          getUsers();
        }}
      >
        No filters
      </button>
      <button
        onClick={() => {
          onlyAdmin().then((data) => {
            setUsers(data);
          });
        }}
      >
        Only Admin List
      </button>
      <div className="table-responsive">
        <table className="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email ID</th>
              <th>Role</th>
              <th>Profile Pic</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.firstname}</td>
                <td>{user.lastname}</td>
                <td>{user.emailid}</td>
                <td>{user.role}</td>
                <td>
                  <div className="profile-pic-container">
                    {user.profilepic ? user.profilepic : "None"}
                  </div>
                </td>
                <td>
                  <button
                    className="button"
                    onClick={() => {
                      navigate(`/editadmin/${user.id}`);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="button"
                    onClick={() => {
                      handleDelete(user.id).then(() => {
                        window.location.reload();
                      });
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserDB;
