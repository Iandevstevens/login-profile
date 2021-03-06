import React from "react";
import "./App.less";
import ROUTES, { RenderRoutes } from "./routes";

function App() {
  return <RenderRoutes routes={ROUTES} />;
}

export default App;
