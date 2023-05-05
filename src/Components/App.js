import React, { useEffect } from "react";
import Home from "./Home";
import Login from "./Login";
import { useSelector, useDispatch } from "react-redux";
import { loginWithToken } from "../store";
import { Link, Routes, Route } from "react-router-dom";

import Map from "./Map";

const App = () => {
  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();
  useEffect(() => {
    // dispatch(loginWithToken());
  }, []);

  return (
    <div>
      <Map />
    </div>
  );
};

export default App;
