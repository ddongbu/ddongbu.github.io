import React, { useState } from "react";
import { Route, HashRouter as Router, Routes } from "react-router-dom";
import Auth from "../routes/Auth";
import Home from "../routes/Home";

const AppRouter = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <Router>
      <Routes>
        {isLoggedIn ? (
          <>
            <Route exact path="/" component={Home} />
          </>
        ) : (
          <Route exact path="/" component={Auth} />
        )}
      </Routes>
    </Router>
  );
};
export default AppRouter;
