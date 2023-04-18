import React from "react";
import { Result } from "antd";

const NoAutorizado = () => {
  return (
    <Result
      status="403"
      title="403"
      subTitle="No tienes permisos para acceder a esta página."
    />
  );
};

export default NoAutorizado;