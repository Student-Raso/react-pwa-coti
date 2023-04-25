import React, {useState, useEffect, useMemo} from 'react';
import {
  Col,
  Row,
  Button,
  Form,
  Input,
  message,
  Upload,
  Select
} from 'antd';

import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';

import {useNavigate} from 'react-router-dom';
import { DefaultLayout } from '../../../components/layouts';
import { useQuery, useModel } from '../../../hooks';
import { lastPathName, respuestas } from '../../../utilities';
import httpService from '../../../services/httpService';
import regimenes from '../../../constants/Regimenes';

const rules = {
  inputText: [{
    required: true,
    message: "No dejar vacío.",
  }],
};

const EmpresaDetalle = ({ setEmpresaValue }) => {

  const endPoint = "v1/empresa";

  const {Option} = Select;
  const {beforePath} = lastPathName();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const query = useQuery();
  const id = query.get("id");
  const editando = Boolean(id);

  const [guardando, setGuardando] = useState(false);
  const [request, setRequest] = useState({});
  const [fileList, setFileList] = useState([]);
  const [imageUrl, setImageUrl] = useState();

  const requestParams = useMemo(() => ({
    name: endPoint,
    id,
    expand: ''
  }), [id]);

  const {
    model,
    modelLoading,
  } = useModel(request);

  const btnGroup = [
    {
      id: 1,
      onClick: () => navigate(`/administracion/${beforePath}`),
      props: { disabled: false, type: "primary",  },
      text: "Volver",
      icon: <ArrowLeftOutlined />,
    },
  ];

  const onFinish = async (values) => {
    try {
      setGuardando(true);
      const body = {
        ...values,
        logo: imageUrl
      }
      if(editando) body.id = id

      const resp = await httpService.post(endPoint, body);
      respuestas(resp);
      if(resp?.status === 200) {
        if (Boolean(setEmpresaValue)) {
          setEmpresaValue(resp?.detalle);
        } else {
          navigate(`/administracion/${beforePath}`);
        }
      }

    } catch (error) {
      console.log('error al guardar: ', error);
    } finally {
      setGuardando(false);
    }
  };

  const onFinishFailed = ({values, errorFields, outOfDate}) => {
    message.warning('Error al guardar: datos incompletos.');
    console.log(values, errorFields, outOfDate);
  };

  const nombrePrefijo = (e) =>{
    const {value} = e?.target
    if(value){
      let resPrefijo = 'E'
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

    // manipulando imagen
    const cambioImg = async (item) => {
      let _imagenes = [...fileList];
      _imagenes[0] = await toBase64(item?.fileList[0]?.originFileObj)
      setFileList([..._imagenes]);
      setImageUrl(_imagenes[0])
    }
  
    const toBase64 = file => new Promise((resolve, reject) => {
      const reader = new FileReader();
      if(file){
        reader.readAsDataURL(file);
      }
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });

    const uploadButton = (
      <div>
        <div
          style={{
            marginTop: 8,
          }}
        >
          {"Subir Imagen"}
        </div>
      </div>
    );

    // Setear form principal
    useEffect(() => {
      if (!editando && !model) return;
      form.setFieldsValue({...model});
      setImageUrl(model?.logo)
    }, [editando, form, model]);

    // Request models
    useEffect(() => {
      setRequest(requestParams);
      return () => setRequest({})
    }, [requestParams]);

  return (
    <DefaultLayout
      btnGroup={{ btnGroup }}
      viewLoading={{
        text: "Guardando...",
        size: "large",
        spinning: guardando || modelLoading,
      }}
    >
      <Form
        form={form}
        name="form"
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Row gutter={{ xs: 10, sm: 10, md: 10, lg: 10 }}>
          
          <Col
            className="gutter-row"
            xs={24}
            sm={24}
            md={12}
            lg={12}
            xxl={12}
          >
            <Form.Item
              label="Nombre"
              name="nombre"
              rules={rules.inputText}
            >
              <Input
                placeholder="Escribir Nombre de la Empresa"
                autoComplete="off"
                onChange={nombrePrefijo}
              />
            </Form.Item>
          </Col>

          <Col
            className="gutter-row"
            xs={24}
            sm={24}
            md={12}
            lg={12}
            xxl={12}
          >
            <Form.Item
              label="Contacto"
              name="contacto"
              rules={rules.inputText}
            >
              <Input
                placeholder="Escribir Contacto"
                autoComplete="off"
              />
            </Form.Item>
          </Col>

          <Col
            className="gutter-row"
            xs={24}
            sm={24}
            md={12}
            lg={12}
            xxl={12}
          >
            <Form.Item
              label="Logo"
              name="logo"
            >
              <Upload
                fileList={fileList}
                beforeUpload={() => true}
                action=""
                showUploadList={false}
                listType="picture-card"
                maxCount={1}
                onChange={(e) => cambioImg(e)}
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="avatar"
                    style={{
                      width: '100%',
                    }}
                  />
                ) : (
                  uploadButton
                )}
              </Upload>
            </Form.Item>
          </Col>

          <Col
            className="gutter-row"
            xs={24}
            sm={24}
            md={12}
            lg={12}
            xxl={12}
          >
            <Form.Item
              label="RFC"
              name="rfc"
              rules={rules.inputText}
            >
              <Input
                placeholder="Escribir RFC"
                autoComplete="off"
              />
            </Form.Item>
          </Col>

          <Col
            className="gutter-row"
            xs={24}
            sm={24}
            md={12}
            lg={12}
            xxl={12}
          >
            <Form.Item
              label="Dirección"
              name="direccion"
              rules={rules.inputText}
            >
              <Input
                placeholder="Escribir Dirección"
                autoComplete="off"
              />
            </Form.Item>
          </Col>

          <Col
            className="gutter-row"
            xs={24}
            sm={24}
            md={12}
            lg={12}
            xxl={12}
          >
            <Form.Item
              label="C.P."
              name="cp"
              rules={rules.inputText}
            >
              <Input
                placeholder="Escribir C.P."
                autoComplete="off"
              />
            </Form.Item>
          </Col>

          <Col
            className="gutter-row"
            xs={24}
            sm={24}
            md={12}
            lg={12}
            xxl={12}
          >
            <Form.Item
              label="Correo"
              name="correo"
              rules={rules.inputText}
            >
              <Input
                placeholder="Escribir Correo"
                autoComplete="off"
              />
            </Form.Item>
          </Col>

          <Col
            className="gutter-row"
            xs={24}
            sm={24}
            md={12}
            lg={12}
            xxl={12}
          >
            <Form.Item
              label="Teléfono"
              name="telefono"
              rules={rules.inputText}
            >
              <Input
                placeholder="Escribir Teléfono"
                autoComplete="off"
              />
            </Form.Item>
          </Col>

          <Col
            className="gutter-row"
            xs={24}
            sm={24}
            md={12}
            lg={12}
            xxl={12}
          >
            <Form.Item
              label="Régimen Fiscal"
              name="regimenFiscal"
              rules={rules.inputText}
            >
              <Select
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
            </Select>
            </Form.Item>
          </Col>

          <Col
            className="gutter-row"
            xs={24}
            sm={24}
            md={12}
            lg={12}
            xxl={12}
          >
            <Form.Item
              label="Sitio Web"
              name="sitioWeb"
              rules={rules.inputText}
            >
              <Input
                placeholder="Escribir Sitio Web"
                autoComplete="off"
              />
            </Form.Item>
          </Col>

          <Col
            className="gutter-row"
            xs={24}
            sm={24}
            md={12}
            lg={12}
            xxl={12}
          >
            <Form.Item
              label="Ciudad"
              name="ciudad"
              rules={rules.inputText}
            >
              <Input
                placeholder="Escribir Ciudad"
                autoComplete="off"
              />
            </Form.Item>
          </Col>

          <Col
            className="gutter-row"
            xs={24}
            sm={24}
            md={12}
            lg={12}
            xxl={12}
          >
            <Form.Item
              label="Estado"
              name="estado"
              rules={rules.inputText}
            >
              <Input
                placeholder="Escribir Estado"
                autoComplete="off"
              />
            </Form.Item>
          </Col>

          <Col
            className="gutter-row"
            xs={24}
            sm={24}
            md={12}
            lg={12}
            xxl={12}
          >
            <Form.Item
              label="Prefijo"
              name="prefijo"
            >
              <Input
                placeholder="Prefijo"
                autoComplete="off"
                readOnly
              />
            </Form.Item>
          </Col>

        </Row>

        <Row gutter={{ xs: 10, sm: 10, md: 10, lg: 10 }}>
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
              >Guardar</Button>
            </Form.Item>
          </Col>
        </Row>

      </Form>

    </DefaultLayout>
  )
}

export default EmpresaDetalle