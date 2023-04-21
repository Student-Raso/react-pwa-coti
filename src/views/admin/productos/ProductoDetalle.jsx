import React, {useState, useEffect, useMemo} from 'react';
import {
  Col,
  Row,
  Button,
  Form,
  Input,
  message,
  Upload,
  InputNumber
} from 'antd';

import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';

import {useNavigate} from 'react-router-dom';
import { DefaultLayout } from '../../../components/layouts';
import { useQuery, useModel } from '../../../hooks';
import { lastPathName, respuestas } from '../../../utilities';
import httpService from '../../../services/httpService';

const rules = {
  inputText: [{
    required: true,
    message: "No dejar vacío.",
  }],
};

const ProductoDetalle = () => {

  const endPoint = "v1/cotizacion-producto";
  
  const { beforePath } = lastPathName();

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
        imagen: imageUrl
      }

    if(editando) {
      body.id = id;
      body.image = imageUrl
    }

      const resp = await httpService.post(endPoint, body);
      respuestas(resp);
      if(resp?.status === 200) {
        navigate(`/administracion/${beforePath}`);
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

  const editandoImagen = React.useCallback(( ) => {
    let _arr = [
      {
        uid: '-1',
        name: model?.producto,
        status: 'done',
        url: model?.imagen
      },
    ]
    setFileList([..._arr]);
  },[model]);

  const onPreview = async (file) => {
    let src = file?.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file?.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };
  
  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    newFileList.length > 0 ? console.log(newFileList[0]) : console.log("nothing")
    setImageUrl(newFileList[0])
  };

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

  useEffect(() => {
    if (model && editando) {
      form.setFieldsValue({
        ...model,
        nombre: model?.nombre,
        id: model?.id,
        imagen: model?.imagen
      })
      editandoImagen();
      setImageUrl(model?.imagen)
    }
  }, [form, model, editando, editandoImagen]);
  
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
              label="Producto"
              name="producto"
              rules={rules.inputText}
            >
              <Input
                placeholder="Escribir Nombre de la Producto"
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
              label="Monto"
              name="monto"
            >
              <InputNumber
                placeholder="Monto de dinero"
                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                style={{width: "100%"}}
                rules={rules.inputText}
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
              label="Imagen"
              name="imagen"
            >
                <Upload
                  action=""
                  listType="picture-card"
                  fileList={fileList}
                  maxCount={1}
                  showUploadList={false}
                  onChange={onChange}
                  onPreview={onPreview}
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

export default ProductoDetalle