import React, { useState } from "react";
import { Link } from "react-router-dom";

const Join = () => {
  const [user, setUser] = useState({
    name: "",
    room: "",
  });

  const handleChange = (event) => {
    setUser({
      ...user,
      [event.currentTarget.name]: event.target.value,
    });
  };

  return (
    <div className="bg-dark text-white">
      <div className="container">
        <div className="d-flex vh-100 justify-content-center align-items-center text-center">
          <form>
            <h1 className="fs-1">Join</h1>
            <div class="mb-3">
              <input
                className="form-control"
                name="name"
                placeholder="Name"
                type="text"
                onChange={handleChange}
              />
            </div>
            <div class="mb-3">
              <input
                className="form-control"
                name="room"
                placeholder="Room"
                type="text"
                onChange={handleChange}
              />
            </div>
            <Link
              onClick={(event) =>
                !user.name || !user.room ? event.preventDefault() : null
              }
              to={`/chat?name=${user.name}&room=${user.room}`}
            >
              <button type="submit" className="form-control btn btn-primary">
                Enter
              </button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Join;
