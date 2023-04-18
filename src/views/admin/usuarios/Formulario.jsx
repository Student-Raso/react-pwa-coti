import React, { useEffect } from 'react';
import {
  Select as AntdSelect,
  Form,
  Row,
  Col,
  Input,
  Button,
  message,
  Divider,
  Typography,
} from 'antd';
import httpService from '../../../services/httpService';
import { respuestas } from '../../../utilities';
import { useNavigate } from 'react-router-dom';

const { Option } = AntdSelect;

const Formulario = ({
  setGuardando,
  endPoint,
  model,
  editing,
  id
}) => {

  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { Title } = Typography;

  const onFinish = async (values) => {
    try {

      const { clave1, clave } = values;

      setGuardando(true);
      let body;
      if (!editing) {
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
      content: 'Verifica que todos los campos estén correctos.',
      style: {
        marginTop: '10vh',
      },
    });
  };

  useEffect(() => {
    if (editing && model) {
      form.setFieldsValue({
        ...model
      });
    }
  },[editing, form, model])

  return (
    <Form
      form={form}
      name='form'
      layout='vertical'
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Row gutter={[16, 0]}>
        <Col
          xs={{ span: 24 }}
          sm={{ span: 24 }}
          md={{ span: 12 }}
          lg={{ span: 12 }}
        >
          <Form.Item
            name='NOMBRE'
            label='Nombre'
            rules={[{ required: true, message: 'Por favor ingresar nombre de Usuario' }]}
          >
            <Input
              autoComplete={'off'}
            />
          </Form.Item>
        </Col>
        <Col
          xs={{ span: 24 }}
          sm={{ span: 24 }}
          md={{ span: 12 }}
          lg={{ span: 12 }}
        >
          <Form.Item
            name='APELLIDOS'
            label='Apellidos'
            rules={[{ required: true, message: 'Por favor ingresar nombre de Usuario' }]}
          >
            <Input
              autoComplete={'off'}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 0]}>

        <Col
          xs={{ span: 24 }}
          sm={{ span: 24 }}
          md={{ span: 12 }}
          lg={{ span: 12 }}
        >
          <Form.Item
            name='EMAIL'
            label='Correo'
            rules={[{ required: true, message: 'Por favor ingresar nombre de Usuario' }]}
          >
            <Input
              autoComplete={'off'}
            />
          </Form.Item>
        </Col>

        <Col
          xs={{ span: 24 }}
          sm={{ span: 24 }}
          md={{ span: 12 }}
          lg={{ span: 12 }}
        >
          <Form.Item
            name='TIPO'
            label='Tipo'
          >
            <AntdSelect>
              <Option value={1}>ACTIVO</Option>
              <Option value={0}>INACTIVO</Option>
            </AntdSelect>
          </Form.Item>
        </Col>

      </Row>

      <Divider my={20} />

      {!editing && (
      <Row gutter={[16, 0]}>
        <Col
          xs={{ span: 24 }}
          sm={{ span: 24 }}
          md={{ span: 12 }}
          lg={{ span: 12 }}
        >
          <Form.Item 
            label='Contraseña'
            name='clave1' 
            rules={[{ required: true, message: 'Por favor ingresar Contraseña' }]}
          >
            <Input 
              type='password' 
              autoComplete={'off'}
              visibilitytoggle="false"
            />

          </Form.Item>
        </Col>
        <Col
          xs={{ span: 24 }}
          sm={{ span: 24 }}
          md={{ span: 12 }}
          lg={{ span: 12 }}
        >
          <Form.Item 
            label='Confirmar Contraseña'
            name='clave' 
            rules={[{ required: true, message: 'Por favor Confirmar Contraseña' }]}
          >
            <Input
              type='password' 
              autoComplete={'off'}
              visibilitytoggle="false"
            />
          </Form.Item>
        </Col>
      </Row>
      )}

      {editing && (
        <>
          <Row gutter={10}>
            <Title level={5}>Cambiar Contraseña</Title>
          </Row>

          <Row gutter={[16, 0]}>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 12 }}
              lg={{ span: 12 }}
            >
              <Form.Item 
                label='Contraseña'
                name='clave1'
              >
                <Input.Password
                  autoComplete={'off'}
                  visibilitytoggle="false"
                />

              </Form.Item>
            </Col>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 12 }}
              lg={{ span: 12 }}
            >
              <Form.Item 
                label='Confirmar Contraseña'
                name='clave'
              >
                <Input.Password
                  autoComplete={'off'}
                  visibilitytoggle="false"
                />
              </Form.Item>
            </Col>
          </Row>
        </>
      )}

      {/* Botón de guardar */}
      <Row gutter={10} style={{alignItems: 'end'}}>
        <Col span={6}>
          <Form.Item>
            <Button block type="primary" htmlType="submit">
              Guardar
            </Button>
          </Form.Item>
        </Col>
      </Row>

      <Divider />

    </Form>
  )
}

export default Formulario