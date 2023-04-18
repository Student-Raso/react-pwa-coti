import React, {useState} from "react";
import {
  ArrowLeftOutlined,
} from "@ant-design/icons";
import {Button, Col, Form, Input, message, Row} from "antd";
import {useNavigate} from "react-router-dom";
import {DefaultLayout} from "../../components/layouts";
import {useModel, useQuery} from "../../hooks";
import HttpService from "../../services/httpService";
import {respuestas} from "../../utilities";
import { Select } from "../../components";


const VinculoDetalle = () => {

  const q = useQuery();
  const id = q.get("id");
  const [form] = Form.useForm();
  const [guardando, setGuardando] = useState(false);
  const navigate = useNavigate();
  const editando = Boolean(id);

  const requestEmpresa = React.useMemo(() => ({
    name: 'v1/empresa',
  }), []);

  const requestProyecto = React.useMemo(() => ({
    name: 'v1/vinculo',
    id: id,
  }), [id]);

  const {
    model
  } = useModel(requestProyecto);

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

      const res = await HttpService.post('v1/vinculo/guardar', body);
      respuestas(res);
      if (res.status === 200) {
        navigate("/psg");
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
            Clave
            <Form.Item name='vin_num_psg'>
              <Input placeholder="Ingresar clave"/>
            </Form.Item>

          </Col>

          <Col span={12}>
            Nombre del Corral
            <Form.Item name='vin_nombre_corral'>
              <Input placeholder="Ingresar nombre"/>
            </Form.Item>
          </Col>
          <Col span={12}>
          <Form.Item
            label="Empresa:"
            name="idEmpresa"
          >
            <Select
              showSearch
              modelsParams={requestEmpresa}
              size='large'
              placeholder="Selecciona una Empresa"
              labelProp={'nombre'}
              valueProp={'id'}
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
                  navigate(`/psg`);
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

export default VinculoDetalle