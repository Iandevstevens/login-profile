import React from "react";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Register from "./pages/auth/Register";
import Home from "./pages/Home";
import GroupRoom from "./pages/GroupRoom";
import SpotifyCallback from "./pages/auth/SpotifyCallback";

import { Route, Switch, Redirect } from "react-router-dom";
import { routeInterface } from "./interfaces";
import MusicRoom from "./pages/MusicRoom";

interface IRenderRoutes {
  routes: routeInterface[];
}

const hasProfile = () => {
  const profile = JSON.parse(
    localStorage.getItem("persist:root") || '{"profile": "{}"}'
  ).profile;
  return profile !== "{}";
};

const ROUTES: routeInterface[] = [
  {
    path: "/app",
    key: "APP",
    component: (props: IRenderRoutes) => {
      if (!hasProfile()) return <Redirect to={"/"} />;
      return <RenderRoutes {...props} />;
    },
    routes: [
      { path: "/app/home", key: "HOME", exact: true, component: Home },
      { path: "/app/room/:id", key: "ROOM", exact: true, component: GroupRoom },
      {
        path: "/app/music-room/:id",
        key: "MUSIC_ROOM",
        exact: true,
        component: MusicRoom,
      },
    ],
  },
  {
    path: "/",
    key: "AUTH",
    component: (props: IRenderRoutes) => {
      if (hasProfile()) return <Redirect to={"/app/home"} />;
      return <RenderRoutes {...props} />;
    },
    routes: [
      {
        path: "/",
        key: "AUTH_LOGIN",
        exact: true,
        component: Login,
      },
      {
        path: "/forgot-password",
        key: "AUTH_FORGOT_PASSWORD",
        exact: true,
        component: ForgotPassword,
      },
      {
        path: "/register",
        key: "AUTH_REGISTER",
        exact: true,
        component: Register,
      },
      {
        path: "/spotify/callback",
        key: "SPOTIFY_CALLBACK",
        exact: true,
        component: SpotifyCallback,
      },
    ],
  },
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
