import React from "react";
import { Col, Layout, Row } from "antd";
const { Content, Footer } = Layout;
const version = import.meta.env.VITE_API_VERSION;

const AuthStyles = {
  layout: {
    height: "100vh",
  },
  content: {
    padding: "0 50px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    textAlign: "center",
  },
};

const AuthLayout = ({ children }) => {
  return (
    <Layout className="layout" style={AuthStyles.layout}>
      <Content style={AuthStyles.content}>
        <div className="site-layout-content">{children}</div>
      </Content>
      <Footer style={AuthStyles.footer}>
        {version} - &copy; Derechos reservados.
      </Footer>
    </Layout>
  );
};

export default AuthLayout;
