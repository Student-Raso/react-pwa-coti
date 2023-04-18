import React, { useState } from "react";
import {
  ArrowLeftOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  message,
  Row,
  Select as AntdSelect,
  Switch,
} from "antd";
import { useNavigate } from "react-router-dom";
import { DefaultLayout } from "../../../components/layouts";
import { useModel, useQuery } from "../../../hooks";
import { respuestas, Roles, ValidarContrasena } from "../../../utilities";
import httpService from '../../../services/httpService';

const UsuarioDetalle = () => {
  const q = useQuery();
  const id = q.get("id");
  const [form] = Form.useForm();
  const [guardando, setGuardando] = useState(false);
  const navigate = useNavigate();
  const editando = Boolean(id);
  const [switchPass, setSwitchPass] = useState(false);
  const endPoint = "v1/usuario";

  const requestProyecto = React.useMemo(
    () => ({
      name: endPoint,
      id: id,
    }),
    [id]
  );

  const { model } = useModel(requestProyecto);

  const btnGroup = [
    {
      id: 1,
      onClick: () => {
        navigate(`/administracion/usuarios`);
      },
      props: { disabled: false, type: "primary" },
      text: "Volver",
      icon: <ArrowLeftOutlined />,
    },
  ];

  const onFinish = async (values) => {
    try {

      const { clave1, clave } = values;

      setGuardando(true);
      let body;
      if (!editando) {
        if (clave1 !== clave) {
          message.error("Las contraseñas no coinciden.");
          return;
        }
        console.log("of !editing")

        body = {
          ...values,
          pwd: clave
        }

      } else {
        if (clave1 !== clave) {
          message.error("Las contraseñas no coinciden.");
          return;
        }

        let _body = {
          pwd: clave1,
          confirmarClave: clave,
          idUsuario: id
        }

        const resClave = await httpService.post(`${endPoint}/cambiar-clave`, _body)
        if (resClave?.status !== 200) {
          respuestas(resClave);
          return;
        }

        body = {
          ...values,
          id: id,
        }
        delete body.clave;
        delete body.clave1;
      }

      const res = await httpService.post(endPoint, body);
      respuestas(res);
      if(res?.status === 200) {
        navigate(`/administracion/usuarios`);
      }
      
    } catch(e) {
      console.log(e)
    } finally {
      setGuardando(false);
    }
  }

  const onFinishFailed = ({ values, errorFields, outOfDate }) => {
    message.warning({
      content: "Verifica que todos los campos estén correctos.",
      style: {
        marginTop: "10vh",
      },
    });
  };

  React.useEffect(() => {
    if (editando && model) {
      form.setFieldsValue({
        ...model,
      });
    }
  }, [editando, form, model]);

  return (
    <DefaultLayout btnGroup={{ btnGroup }}>
      <Form
        form={form}
        name="form"
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Row gutter={[10, 10]}>
          <Col span={12}>
            <Form.Item label="Nombre" name="nombre">
              <Input placeholder="Ingresar nombre" size="large" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Correo Electrónico" name="correo"
              rules={[
                {
                  required: true,
                  message: "Es necesario llenar este campo.",
                },
                {
                  pattern: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                  message: "Introduce un correo electrónico válido."
                }
              ]}
            >
              <Input
                size="large"
                autoComplete={"off"}
                placeholder="Ingresar correo electrónico"
              />
            </Form.Item>
          </Col>

        </Row>

        <Row gutter={[10, 10]}>
          <Col span={12}>
            <Form.Item 
              label="Rol"
              name="rol"
            >
              <AntdSelect
                placeholder="Seleccionar Tipo"
                allowClear
                size="large"
                options={Roles.map((item) => ({
                  key: item.value,
                  value: item.value,
                  label: item.label,
                }))}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            {
              editando ?
              <Form.Item label="Cambiar contraseña">
                <Switch defaultChecked={false} style={{marginLeft:'10px'}} onChange={()=>{
                  switchPass ? setSwitchPass(false) : setSwitchPass(true)
                }}/>
              </Form.Item>
                
              :
              null
            }
          </Col>
        </Row>
        <Row gutter={[10, 10]}>
          <Col span={12} style={switchPass||!editando ? null: {display:"none"}}>
            <Form.Item
              label="Contraseña"
              name="password"
              rules={[
                {
                  required: !editando||switchPass,
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
                size="large"
                type="password"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
          <Col span={12} style={switchPass||!editando ? null: {display:"none"}}>
            <Form.Item
              label="Confirmar Contraseña"
              name="confirmarClave"
              rules={[
                {
                  required: !editando||switchPass,
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
                size="large"
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
        <Row gutter={[10, 10]} style={{ marginTop: "10px" }}>
        <Col
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 6 }}
            lg={{ span: 6 }}
          >
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={guardando}
                style={{ width: "100%" }}
              >
                Guardar
              </Button>
            </Form.Item>
          </Col>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 6 }}
            lg={{ span: 6 }}
          >
            <Form.Item>
              <Button
                type="primary"
                style={{ backgroundColor: "#5A6268", width: "100%" }}
                onClick={() => {
                  navigate(`/administracion/usuarios`);
                }}
              >
                Volver
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </DefaultLayout>
  );
};

export default UsuarioDetalle;
