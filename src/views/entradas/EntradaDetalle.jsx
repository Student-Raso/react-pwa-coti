import { Button, Col, DatePicker, Form, Input, Row, Select as AntdSelect} from "antd";
import { Select } from "../../components";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DefaultLayout } from "../../components/layouts";
import { useModel, useQuery } from "../../hooks";
import HttpService from "../../services/httpService";
import { respuestas } from "../../utilities";
import dayjs from "dayjs";

const EntradaDetalle = () => {

const q = useQuery();
const id = q.get("id");
const [form] = Form.useForm();
const [guardando, setGuardando] = useState(false);
const navigate = useNavigate();
const editando = Boolean(id);
const [estados, setEstados] = useState([]);

const requestEntrada = useMemo(() => ({
  name: 'v1/entradas',
  id: id,
  expand: 'v1/entradas'
}), [id]);

const requestPsg = useMemo(() => ({
  name: 'v1/vinculo',
}), []);

const {
  model
} = useModel(requestEntrada);

async function getEstados() {
  return await HttpService.get('v1/estados');
}

useEffect(() => {
  getEstados()
    .then(response => setEstados(response.resultado));
}, [])

let onFinish = async (values) => {
  try {
    setGuardando(true);
    let body = {
      ...values,
      id: id
    }
    console.log(body.ent_fecha_entrada);
    const res = await HttpService.post('v1/entradas', body);
    respuestas(res);
    if (res.status === 200) {
      navigate("/entradas");
    }
  } catch (e) {
    console.log(e)
  } finally {
    setGuardando(false);
  }
  return true;
}

useEffect(() => {
if (editando && model) {
  form.setFieldsValue({
    ...model,
    ent_fecha_entrada: model?.ent_fecha_entrada ? dayjs(model?.ent_fecha_entrada) : undefined,
  })
}
}, [editando, form, model])

return (
<DefaultLayout>
  <Form form={form} name='form' layout='vertical' onFinish={onFinish}>
    <Row gutter={[10, 10]}>
      <Col xs={{span:24}}sm={{span:24}}md={{span:6}} lg={{span:6}}>
        <Form.Item
          label="N° Animal:"
          name="ent_num_animal"
          rules={[{ required: true, message: "Campo requerido." }]}
        >
          <Input
            size={"large"}
            placeholder="1 - 9,999"
          />
        </Form.Item>
      </Col>
      <Col xs={{span:24}}sm={{span:24}}md={{span:6}} lg={{span:6}}>
        <Form.Item
          label="Arete SINIIGA:"
          name="ent_arete_siniiga"
          rules={[{ required: true, message: "Campo requerido." }]}
        >
          <Input
            size={"large"}
            placeholder="1 - 9,999,999,999"
          />
        </Form.Item>
      </Col>
      <Col xs={{span:24}}sm={{span:24}}md={{span:6}} lg={{span:6}}>
        <Form.Item
          label="Arete Particular:"
          name="ent_arete_particular"
          rules={[{ required: true, message: "Campo requerido." }]}
        >
          <Input
            size={"large"}
          />
        </Form.Item>
      </Col>
      <Col xs={{span:24}}sm={{span:24}}md={{span:6}} lg={{span:6}}>
        <Form.Item
          label="Sexo:"
          name="ent_sexo"
          rules={[{ required: true, message: "Campo requerido." }]}
        >
          <AntdSelect
            size={"large"}
            placeholder={"Selecciona el sexo"}
            options={[
              { value: 'Hembra', label: 'Hembra' },
              { value: 'Macho', label: 'Macho' },
            ]}
          />
        </Form.Item>
      </Col>
    </Row>
    <Row gutter={[10, 10]}>
      <Col xs={{span:24}}sm={{span:24}}md={{span:6}} lg={{span:6}}>
        <Form.Item
          label="N° corral:"
          name="ent_num_corral"
          rules={[{ required: true, message: "Campo requerido." }]}
        >
          <Input
            size={"large"}
          />
        </Form.Item>
      </Col>
      <Col xs={{span:24}}sm={{span:24}}md={{span:6}} lg={{span:6}}>
        <Form.Item
          label="Fecha:"
          name="ent_fecha_entrada"
          rules={[{ required: true, message: "Campo requerido." }]}
        >
          <DatePicker
            format={'DD/MM/YYYY'}
            size="large"
            style={{width:'100%'}}
          />
        </Form.Item>
      </Col>
      <Col xs={{span:24}}sm={{span:24}}md={{span:6}} lg={{span:6}}>
        <Form.Item
          label="N° de Permiso Estatado:"
          name="ent_num_permiso_entrada"
          rules={[{ required: true, message: "Campo requerido." }]}
        >
          <Input
            size={"large"}
          />
        </Form.Item>
      </Col>
      <Col xs={{span:24}}sm={{span:24}}md={{span:6}} lg={{span:6}}>
        <Form.Item
          label="Num. Guia de Transito:"
          name="ent_num_guia_transito"
          rules={[{ required: true, message: "Campo requerido." }]}
        >
          <Input
            size={"large"}
          />
        </Form.Item>
      </Col>
    </Row>
    <Row gutter={[10, 10]}>
      <Col xs={{span:24}}sm={{span:24}}md={{span:6}} lg={{span:6}}>
        <Form.Item
          label="Num. Guia de REEMO:"
          name="ent_num_guia_reemo"
          rules={[{ required: true, message: "Campo requerido." }]}
        >
          <Input
            size={"large"}
          />
        </Form.Item>
      </Col>
      <Col xs={{span:24}}sm={{span:24}}md={{span:6}} lg={{span:6}}>
        <Form.Item
          label="Constancia de Tratamiento Garrapaticida:"
          name="ent_CTG"
          rules={[{ required: true, message: "Campo requerido." }]}
        >
          <Input
            size={"large"}
          />
        </Form.Item>
      </Col>
      <Col xs={{span:24}}sm={{span:24}}md={{span:6}} lg={{span:6}}>
        <Form.Item
          label="Estado de Origen:"
          name="ent_estado_origen"
          rules={[{ required: true, message: "Campo requerido." }]}
        >
          <AntdSelect
            size={"large"}
            placeholder={"selecciona un estado"}
            options={estados.map(estado => ({value:estado.nombre, label: estado.nombre}))}
          />
        </Form.Item>
      </Col>
      <Col xs={{span:24}}sm={{span:24}}md={{span:6}} lg={{span:6}}>
        <Form.Item
          label="Num. Certificado Zoosanitario:"
          name="ent_num_cert_zoosanitario"
          rules={[{ required: true, message: "Campo requerido." }]}
        >
          <Input
            size={"large"}
          />
        </Form.Item>
      </Col>
    </Row>
    <Row gutter={[10, 10]}>
      <Col xs={{span:24}}sm={{span:24}}md={{span:6}} lg={{span:6}}>
        <Form.Item
          label="Num. Dictamen Negativo de TB:"
          name="ent_num_dnTB"
          rules={[{ required: true, message: "Campo requerido." }]}
        >
          <Input
            size={"large"}
          />
        </Form.Item>
      </Col>
      <Col xs={{span:24}}sm={{span:24}}md={{span:6}} lg={{span:6}}>
        <Form.Item
          label="Num. Dictamen Negativo de BR:"
          name="ent_num_dnBR"
          rules={[{ required: true, message: "Campo requerido." }]}
        >
          <Input
            size={"large"}
          />
        </Form.Item>
      </Col>
      <Col xs={{span:24}}sm={{span:24}}md={{span:6}} lg={{span:6}}>
        <Form.Item
          label="Num. Fleje:"
          name="ent_num_fleje"
          rules={[{ required: true, message: "Campo requerido." }]}
        >
          <Input
            size={"large"}
          />
        </Form.Item>
      </Col>
      <Col xs={{span:24}}sm={{span:24}}md={{span:6}} lg={{span:6}}>
        <Form.Item
          label="ID PSG:"
          name="ID_vinculo"
          rules={[{ required: true, message: "Campo requerido." }]}
        >
          <Select
            showSearch
            modelsParams={requestPsg}
            size='large'
            placeholder="Selecciona un motivo"
            labelProp={'vin_nombre_corral'}
            valueProp={'ID_vinculo'}
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
                  navigate(`/salidas`);
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

export default EntradaDetalle;