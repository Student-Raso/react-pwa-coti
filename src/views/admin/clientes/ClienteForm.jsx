import React from 'react'
import { Button, Col, Form, Input, message, Row, Select as AntSelect } from 'antd';
import { respuestas } from '../../../utilities';
import { useNavigate } from "react-router-dom";
import httpService from "../../../services/httpService";
import { useModel, useQuery } from "../../../hooks";
import { SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import regimenes from '../../../constants/Regimenes';
import { DefaultLayout } from '../../../components/layouts';

const {Option} = AntSelect;

const ClienteForm = ({
  setClienteValue = null
}) => {

  const [form] = Form.useForm();
  const navigate = useNavigate();
  const navRoute = 'administracion/clientes';
  const endPoint = 'v1/cliente';
  const [request, setRequest] = React.useState({})
  const [guardando, setGuardando] = React.useState(false);

  const q = useQuery();
  const id = q.get("id");
  const editando = Boolean(id);

  const btnGroup = [
    {
      id: 1,
      onClick: () => {
        navigate(`/administracion/clientes`)
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

      if (id)
        body.id = id

      const res = await httpService.post(endPoint, body);
      respuestas(res);
      if (res.status === 200) {
        if (Boolean(setClienteValue)) {
          setClienteValue(res?.detalle);
        } else {
          navigate(`/${navRoute}`);
        }
      }
    } catch (error) {
      console.log("error al guardar: ", error);
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

  const nombrePrefijo = (e) =>{
    const {value} = e?.target
    if(value){
      let resPrefijo = 'C'
      if(value?.includes(' ')) {
        const arrPrefijo = value?.split(' ');
        for (let i = 0, o = arrPrefijo.length; i < o; i++) {
          if(arrPrefijo[i]?.length > 2){
            resPrefijo += arrPrefijo[i].substr(0,1).toUpperCase();
          }
        }
      }else {
        resPrefijo += value.substr(0,1).toUpperCase();
      }
      
      form.setFieldsValue({
        prefijo: resPrefijo
      })
    }
  }

  const requestParams = React.useMemo(() => ({
    name: endPoint,
    id: id,
    expand: ''
  }), [id]);

  const {
    model
  } = useModel(request);

  React.useEffect(() => {
    if (editando && model) {
      form.setFieldsValue({
        ...model
      })
    }
  }, [editando, form, model])

  // Request models
  React.useEffect(() => {
    setRequest(requestParams);
    return () => setRequest({})
  }, [requestParams]);


  return (
    <DefaultLayout
      btnGroup={ setClienteValue ? { btnGroup } : null }
      viewLoading={{ spinning: guardando }}
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
              <Input
                placeholder="Ingresar Nombre"
                autoComplete="off"
                onChange={nombrePrefijo}
              />
            </Form.Item>

          </Col>

          <Col span={12}>
            <Form.Item label='Responsable' name='responsable'>
              <Input placeholder="Ingresar Responsable" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[10, 10]}>
          <Col span={12}>
            <Form.Item label='RFC' name='rfc'>
              <Input placeholder="Ingresar RFC" />
            </Form.Item>

          </Col>

          <Col span={12}>
            <Form.Item label='Direcciòn' name='direccion'>
              <Input placeholder="Ingresar direcciòn" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[10, 10]}>
          <Col span={12}>
            <Form.Item label='C.P.' name='cp'>
              <Input placeholder="Ingresar Còdigo Postal" />
            </Form.Item>

          </Col>

          <Col span={12}>
            <Form.Item label='Telèfono' name='telefono'>
              <Input placeholder="Ingresar Còdigo Postal" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[10, 10]}>
          <Col span={12}>
            <Form.Item
              label="Regimen Fiscal"
              name="idRegimen"
            >
              <AntSelect
                showSearch
                style={{ width: "100%" }}
                placeholder="Buscar"
                optionFilterProp="children"
              >
                {regimenes.map((item) => (
                  <Option key={item?.id} value={item?.id}>
                    {item?.name}
                  </Option>
                ))}
              </AntSelect>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label='Correo' name='correo'>
              <Input placeholder="Ingresar Correo" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[10, 10]}>
          <Col span={12}>
            <Form.Item label='Ciudad' name='ciudad'>
              <Input placeholder="Ingresar Ciudad" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label='Estado' name='estado'>
              <Input placeholder="Ingresar Estado" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[10, 10]}>
          <Col span={12}>
            <Form.Item
              label='Prefijo'
              name='prefijo'>
              <Input
                placeholder="Prefijo"
                autoComplete="off"
                readOnly
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='consecutivo' name='consecutivo'>
              <Input placeholder="Ingresar Consecutivo" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[10, 10]} style={{ marginTop: "10px" }}>
          <Col
            xs={{ span: 24, offset: 0 }}
            sm={{ span: 24, offset: 0 }}
            md={{ span: 5, offset: 19 }}
            lg={{ span: 5, offset: 19 }}
            xxl={{ span: 5, offset: 19 }}
          >
            <Form.Item>
              <Button
                type="primary"
                block
                size='large'
                htmlType="submit"
                loading={guardando}
                icon={<SaveOutlined />}
              >
                Guardar
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </DefaultLayout>
  )
}

export default ClienteForm