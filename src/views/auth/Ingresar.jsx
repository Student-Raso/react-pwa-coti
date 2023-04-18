import React from "react";
import { LockOutlined, UserOutlined, LoadingOutlined } from "@ant-design/icons";
import { Button, Form, Input, Spin, Row, Col } from "antd";
import { useAuth } from "../../hooks";

const SignInStyles = {
  container: {
    background: "#fff",
    backdropFilter: "blur(50px)",
    boxShadow: "0 2px 10px 2px rgb(0 0 0 / 10%)",
    borderRadius: 6,
    padding: "0px 20px 0px 0px",
    width: 500,
  },
  logoContainer: {
    textAlign: "center",
    marginBottom: 20,
  },
};

const antIcon = (
  <LoadingOutlined
    style={{
      fontSize: 24,
    }}
    spin
  />
);

const reglas = {
  usuario: [
    {
      type: "email",
    },
  ],
  clave: [
    {
      min: 6,
    },
  ],
};

const Ingresar = () => {
  const { signIn, sessionLoading } = useAuth();

  const onFinish = (values) => {
    const { usuario, clave } = values;
    signIn(usuario, clave);
  };

  return (
    <div style={SignInStyles.container}>
      <Spin indicator={antIcon} spinning={sessionLoading}>
        <Form
          name="normal_login"
          className="login-form"
          layout="vertical"
          initialValues={{
            remember: false,
          }}
          onFinish={onFinish}
        >
          <Row gutter={10}>
            <Col span={8}>
              <div
    
                alt="vacas sider"
                style={{ objectFit: "none",objectPosition:"-150px", width: "100%", height: "100%",borderTopLeftRadius:"6px", borderBottomLeftRadius:"6px", backgroundColor: "#a02867" }}
              ></div>
            </Col>
            <Col span={16} style={{marginBottom:"70px"}}>
              <Row gutter={10}>
                <Col span={24}>
                  <div style={SignInStyles.logoContainer}>
                    <h1>
                    Desarrollo Político
                    </h1>
                  </div>
                </Col>
              </Row>
              <Row gutter={10}>
                <Col span={24}>
                  <Form.Item
                    name="usuario"
                    label="Correo electrónico"
                    rules={reglas.usuario}
                  >
                    <Input
                      prefix={<UserOutlined className="site-form-item-icon" />}
                      placeholder="correo@dominio.com"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={10}>
                <Col span={24}>
                  <Form.Item
                    name="clave"
                    label="Contraseña"
                    rules={reglas.clave}
                  >
                    <Input.Password
                      prefix={<LockOutlined className="site-form-item-icon" />}
                      type="new-password"
                      autoComplete="off"
                      autoCorrect="off"
                      placeholder="Contraseña"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <br />

              <Row gutter={10}>
                <Col span={8}>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      block
                      className="login-form-button"
                    >
                      Ingresar
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>
      </Spin>
    </div>
  );
};

export default Ingresar;
