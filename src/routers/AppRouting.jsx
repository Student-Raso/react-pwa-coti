import React from "react";
import { useApp, useAuth } from "../hooks";

import PrivateRouter from "./PrivateRouter";
import PublicRouter from "./PublicRouter";

const AppRouting = () => {
  const { sessionLoading } = useAuth();
  const { token } = useApp();

  if (sessionLoading) return null;

  return Boolean(token) ? <PrivateRouter /> : <PublicRouter />;
};

export default AppRouting;
