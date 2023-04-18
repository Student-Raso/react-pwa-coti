import React from "react";
import { Spin } from "antd";

const AppLoading = (props) => {
  const { text, loading, children: ChildComponents } = props;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Spin
        spinning={loading}
        size="large"
        delay={5}
        tip={text || "Cargando aplicación..."}
      >
        {loading ? <div style={{ height: "100vh" }} /> : ChildComponents}
      </Spin>
    </div>
  );
};

export default AppLoading;
