import React, { useState } from "react";
import {
  Row,
  Col,
  Input,
  Form,
  Button,
  Divider,
  Select as AntdSelect,
  message,
  Switch,
} from "antd";
import httpService from "../../services/httpService";
import { useAuth, useQuery } from "../../hooks";
import { DefaultLayout } from "../../components/layouts";
import { Roles } from "../../utilities";
import { respuestas } from "../../utilities";
import { useNavigate } from "react-router-dom";
import { Select } from "../../components";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { ValidarContrasena } from "../../utilities";

const Perfil = () => {
  const q = useQuery();
  const id = q.get("id");
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [guardando, setGuardando] = useState(false);
  const [switchPass, setSwitchPass] = useState(false);

  const { user } = useAuth();
  
  React.useEffect(() =>
    form.setFieldsValue({
      ...user,
    })
  );

  //const id = user

  const requestEmpresa = React.useMemo(
    () => ({
      name: "v1/empresa",
    }),
    []
  );

  let onFinish = async (values) => {
    try {
      setGuardando(true);
      let body = {
        ...values,
        id: user.ID_USUARIOS,
      };
      const res = await httpService.post("v1/usuarios/guardar", body);
      respuestas(res);

      if (res.status === 200) {
        navigate("/");
      }
    } catch (e) {
      console.log(e);
    } finally {
      setGuardando(false);
    }
  };

  const onFinishFailed = ({ values, errorFields, outOfDate }) => {
    message.warning({
      content: "Verifica que todos los campos estén correctos.",
      style: {
        marginTop: "10vh",
      },
    });
  };

  return (
    <DefaultLayout>
      <Form
        form={form}
        name="form"
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Row gutter={[10, 10]}>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 12 }}
            lg={{ span: 12 }}
          >
            <Form.Item label="Nombre" name="NOMBRE">
              <Input placeholder="Nombre" />
            </Form.Item>
          </Col>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 12 }}
            lg={{ span: 12 }}
          >
            <Form.Item label="Apellidos" name="APELLIDOS">
              <Input placeholder="Apellidos" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[10, 10]}>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 12 }}
            lg={{ span: 12 }}
          >
            <Form.Item label="E-mail" name="EMAIL">
              <Input placeholder="E-mail" />
            </Form.Item>
          </Col>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 12 }}
            lg={{ span: 12 }}
          >
            <Form.Item label="Empresa" name="idEmpresa">
              <Select
                showSearch
                placeholder="Selecciona una Empresa"
                modelsParams={requestEmpresa}
                labelProp={"nombre"}
                valueProp={"id"}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[10, 10]}>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 12 }}
            lg={{ span: 12 }}
          >
            <Form.Item label="Tipo" name="TIPO">
              <AntdSelect
                placeholder="Seleccionar Tipo"
                allowClear
                options={Roles.map((item) => ({
                  key: item.value,
                  value: item.value,
                  label: item.label,
                }))}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
              <Form.Item label="Cambiar contraseña">
                <Switch defaultChecked={false} style={{marginLeft:'10px'}} onChange={()=>{
                  switchPass ? setSwitchPass(false) : setSwitchPass(true)
                }}/>
              </Form.Item>
          </Col>
        </Row>
        <Row gutter={[10, 10]}>
          <Col span={12} style={switchPass ? null: {display:"none"}}>
            <Form.Item
              label="Contraseña"
              name="PASS"
              rules={[
                {
                  required:switchPass,
                  message: "Confirma tu contraseña.",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value) return Promise.resolve();
                    if (ValidarContrasena(value)) {
                      return Promise.resolve();
                    } else {
                      return Promise.reject(
                        new Error(
                          "La contraseña debe de contener al menos 8 caracteres, Máximo 15, Al menos una letra mayúscula," +
                            " una letra minúcula, un número, no espacios en blanco y al menos 1 caracter especial( @$!%*?& )"
                        )
                      );
                    }
                  },
                }),
              ]}
            >
              <Input.Password
                autoComplete={"off"}
                type="password"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
          <Col span={12} style={switchPass ? null: {display:"none"}}>
            <Form.Item
              label="Repetir Contraseña"
              name="REPETIRPASS"
              rules={[
                {
                  required: switchPass,
                  message: "Confirma tu contraseña.",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("PASS") === value) {
                      return Promise.resolve();
                    }
                    console.log(getFieldValue("PASS"), value);
                    return Promise.reject(
                      new Error("Las contraseñas no coinciden.")
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                autoComplete={"off"}
                type="password"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[10, 10]}>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 6 }}
            lg={{ span: 6 }}
            offset={18}
          >
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: "100%", marginTop: "20px" }}
            >
              Guardar Cambios
            </Button>
          </Col>
        </Row>
      </Form>
    </DefaultLayout>
  );
};

export default Perfil;
