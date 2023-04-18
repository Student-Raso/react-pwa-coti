import React from "react";
import { Routes, Route } from "react-router-dom";
import { AppLoading } from "../components";
import { DashboardLayout } from "../components/layouts";
import { useAuth } from "../hooks";
import { dashboardRoutes } from "./routes";

const routeMapper = (route, index) =>
  route?.routes?.length > 0 ? (
    route?.routes
      ?.map((r) => ({ ...r, path: route.path + r.path, layout: route.layout }))
      .map(routeMapper)
  ) : (
    <Route
      key={route.path + (index + 1).toString()}
      exact={Boolean(route.layout === "dashboard")}
      path={route.path}
      // render={(props) => <route.component {...props} route={route} />}
      element={ <route.element /> }
    />
  );

const PrivateRouter = () => {

  const { user, userLoading } = useAuth();
  
  const filtroUsuarios = ({name, validRoles}) => {
    if(!Boolean(validRoles)){
      return true;
    }
    if(validRoles.includes(user?.TIPO)){
      return true;
    }
    return false;
  }

  if (!user && userLoading) {
    return <AppLoading />;
  }
  let rutas = dashboardRoutes;
  return (
    <DashboardLayout>
      <Routes>{rutas.map(routeMapper)}</Routes>
    </DashboardLayout>
  );
};

export default PrivateRouter;