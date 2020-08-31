import React from "react";
import { Route, Switch } from "react-router-dom";
import { routeInterface } from "./interfaces";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Register from "./pages/Register";
import Home from "./pages/Home";

interface IRenderRoutes {
  routes: routeInterface[];
}

const ROUTES: routeInterface[] = [
  { path: "/", key: "ROOT", exact: true, component: Login },
  {
    path: "/forgot-password",
    key: "FORGOT_PASSWORD",
    exact: true,
    component: ForgotPassword,
  },
  {
    path: "/register",
    key: "REGISTER",
    exact: true,
    component: Register,
  },
  { path: "/home", key: "HOME", exact: true, component: Home },
  // {
  //   path: "/app",
  //   key: "APP",
  //   component: (props: IRenderRoutes) => {
  //     if (!localStorage.getItem("user")) {
  //       alert("You need to log in to access app routes");
  //       return <Redirect to={"/"} />;
  //     }
  //     return <RenderRoutes {...props} />;
  //   },
  //   routes: [
  //     {
  //       path: "/app",
  //       key: "APP_ROOT",
  //       exact: true,
  //       component: () => <h1>App Index</h1>,
  //     },
  //     {
  //       path: "/app/page",
  //       key: "APP_PAGE",
  //       exact: true,
  //       component: () => <h1>App Page</h1>,
  //     },
  //   ],
  // },
];

export default ROUTES;

function RouteWithSubRoutes(route: routeInterface) {
  return (
    <Route
      path={route.path}
      exact={route.exact}
      render={(props) => <route.component {...props} routes={route.routes} />}
    />
  );
}

export function RenderRoutes({ routes }: IRenderRoutes) {
  return (
    <Switch>
      {routes.map((route, i) => {
        return <RouteWithSubRoutes {...route} />;
      })}
      <Route component={() => <h1>Not Found!</h1>} />
    </Switch>
  );
}
