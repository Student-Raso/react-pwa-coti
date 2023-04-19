import React, {useState} from "react";
import {
  ArrowLeftOutlined,
} from "@ant-design/icons";
import {Button, Col, Form, Input, message, Row} from "antd";
import {useNavigate} from "react-router-dom";
import {DefaultLayout} from "../../../components/layouts";
import {useModel, useQuery} from "../../../hooks";
import HttpService from "../../../services/httpService";
import {respuestas} from "../../../utilities";
import { Select } from "../../../components";


const ClienteDetalle = () => {

  const q = useQuery();
  const id = q.get("id");
  const [form] = Form.useForm();
  const [guardando, setGuardando] = useState(false);
  const navigate = useNavigate();
  const editando = Boolean(id);
  const url = 'administracion/clientes';

  const request = React.useMemo(() => ({
    name: 'v1/cliente',
  }), []);


  const {
    model
  } = useModel(request);

  const btnGroup = [
    {
      id: 1,
      onClick: () => {
        navigate(`/psg`)
      },
      props: {disabled: false, type: "primary"},
      text: "Volver",
      icon: <ArrowLeftOutlined/>
    }
  ];

  let onFinish = async (values) => {
    try {
      setGuardando(true);
      let body = {
        ...values,
      }

      if(id)
        body.ID_vinculo = id

      const res = await HttpService.post('v1/cliente/guardar', body);
      respuestas(res);
      if (res.status === 200) {
        navigate(`/${url}`);
      }
    } catch (e) {
      console.log(e)
    } finally {
      setGuardando(false);
    }
  }

  const onFinishFailed = ({values, errorFields, outOfDate}) => {
    message.warning({
      content: 'Verifica que todos los campos estén correctos.',
      style: {
        marginTop: '10vh',
      },
    });
  };

  React.useEffect(() => {
    if (editando && model) {
      form.setFieldsValue({
        ...model
      })
    }
  }, [editando, form, model])

  return (
    <DefaultLayout
      btnGroup={{btnGroup}}
    >
      <Form
        form={form}
        name='form'
        layout='vertical'
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Row gutter={[10, 10]}>
          <Col span={12}>
            <Form.Item label='Nombre' name='nombre'>
              <Input placeholder="Ingresar Nombre"/>
            </Form.Item>

          </Col>

          <Col span={12}>
            <Form.Item label='Responsable' name='responsable'>
              <Input placeholder="Ingresar Responsable"/>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[10, 10]}>
          <Col span={12}>
            <Form.Item label='RFC' name='rfc'>
              <Input placeholder="Ingresar RFC"/>
            </Form.Item>

          </Col>

          <Col span={12}>
            <Form.Item label='Direcciòn' name='direccion'>
              <Input placeholder="Ingresar direcciòn"/>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[10, 10]}>
          <Col span={12}>
            <Form.Item label='C.P.' name='cp'>
              <Input placeholder="Ingresar Còdigo Postal"/>
            </Form.Item>

          </Col>

          <Col span={12}>
            <Form.Item label='Correo' name='correo'>
              <Input placeholder="Ingresar Correo"/>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[10, 10]}>
          <Col span={12}>
            <Form.Item label='Telèfono' name='telefono'>
              <Input placeholder="Ingresar Còdigo Postal"/>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label='Correo' name='correo'>
              <Input placeholder="Ingresar Correo"/>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[10, 10]}>

          <Col span={12}>
            <Form.Item
              label="Regimen Fiscal"
              name="idRegimen"
            >
              <Select
                showSearch
                modelsParams={request}
                size='large'
                placeholder="Selecciona un règimen"
                labelProp={'nombre'}
                valueProp={'id'}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='Ciudad' name='ciudad'>
              <Input placeholder="Ingresar Ciudad"/>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[10, 10]}>
          <Col span={12}>
            <Form.Item label='Estado' name='estado'>
              <Input placeholder="Ingresar Estado"/>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label='Prefijo' name='prefijo'>
              <Input placeholder="Ingresar Prefijo"/>
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
                  navigate(`/${url}`);
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
}

export default ClienteDetalle