import React, { useEffect, useState } from 'react';

import {
  Col,
  Row,
  Button,
  Form,
  Input,
  message,
  Modal,
  Table,
  Upload,
  DatePicker,
  Tooltip,
  InputNumber,
} from 'antd';

import ImgCrop from 'antd-img-crop';

import {
  ArrowLeftOutlined,
  SaveOutlined,
  CloseOutlined,
  PlusCircleOutlined,
  FilePdfOutlined
} from '@ant-design/icons';

import { useNavigate } from 'react-router-dom';
import DefaultLayout from '../../components/layouts/DefaultLayout';
import { useQuery, useModel } from "../../hooks";
import moment from "moment";
import locale from 'antd/lib/date-picker/locale/es_ES';
import 'moment/locale/es-mx';
import httpService from '../../services/httpService';
import { Select } from '../../components';
import ClienteForm from '../admin/clientes/ClienteForm';
import { EmpresaDetalle } from '../admin/empresas';

const baseUrl = import.meta.env.VITE_API_URL;

const CotizacionDetalle = () => {

  const basePdf = `${baseUrl}/pdf/`
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const query = useQuery();
  const id = query.get("id");
  const editing = !!id;

  // estados
  const [loading, setLoading] = useState(false);
  const [request, setRequest] = useState({});
  const [productosTabla, setProductosTabla] = useState([]);
  const [empresaValue, setEmpresaValue] = useState(null);
  const [clienteValue, setClienteValue] = useState(null);
  const [openEmpresa, setOpenEmpresa] = useState(false);
  const [openCliente, setOpenCliente] = useState(false);
  const [arrImagenes, setArrImagenes] = useState([]);
  
    // estados calculos
    const [subTotal,setSubTotal] = useState(0);
    const [iva, setIva] = useState(0);
    const [total, setTotal] = useState(0);
  
    //copia modelo
    const [copiaModel,setCopiaModel] = useState([]);
  
    const { Option } = Select;
  
    const {
      model,
    } = useModel(request);

    const cotizacionInfo = {
      cotizacion: "Cotización: ",
      folio: model?.folio,
      empresa: "Empresa: ",
      nombreEmpresa: model?.empresa?.nombre,
      cliente: "Cliente: ",
      clienteNombre: model?.cliente?.nombre
    }
    
    const requestEmpresa = React.useMemo(() => ({
      name: 'v1/empresa',
    }), []);

    const requestCliente = React.useMemo(() => ({
      name: 'v1/cliente',
    }), []);
  

  let btnGroup = [
    {
      id: 1,
      onClick: () => {
        navigate(`/cotizaciones`);
      },
      props: { disabled: false, type: "primary" },
      text: "Volver",
      icon: <ArrowLeftOutlined />,
    },
  ];

  if (model) {
    btnGroup.push({
      id: 2,
      onClick: () => window.open(`${basePdf}cotizacion?id=${model?.id}`),
      props: { color: '#ff4d4f' },
      text: "Imprimir PDF",
      icon: <FilePdfOutlined />,
    })
  } 

  const columns = [
    {
      title: 'Acciones',
      key: 'id',
      dataIndex: 'id',
      width: 100,
      align: 'center',
      render: (_, item) => (
        <Row gutter={5}>
          <Button
            danger
            icon={<CloseOutlined />}
            key={item}
            onClick={() => {
              eliminarProducto(item)
            }}
          />
        </Row>
      )
    },
    {
      title: 'Cantidad',
      dataIndex: 'cantidad',
      key: 'cantidad',
      render: (_, item, index) => (
        <InputNumber
          key={'cantidad' + index}
          min={0}
          defaultValue={item?.cantidad}
          onChange={(e) => {
            cambio('cantidad', index, e);
          }}
          type={'number'}
        />
      ),
    },
    {
      title: 'Concepto',
      dataIndex: 'producto',
      key: 'producto',
      width: 500,
      render: (_, item, index) => (
        <Input
          size='small'
          key={'producto' + index}
          defaultValue={item?.producto}
          onChange={(e) => cambio('producto', index, e?.target?.value)}
          maxLength={10000}
          type={'text'}
        />
      ),
    },
    {
      title: 'Precio Unitario',
      dataIndex: 'monto',
      key: 'monto',
      render: (_, item, index) => (
        <InputNumber
          key={'monto' + index}
          min={0}
          defaultValue={editing ? item?.monto : 0}
          type={'number'}
          step={0.01}
          onChange={(e) => {
            cambio('monto', index, e);
          }}
        />
      ),
    },
    {
      title: 'Imagen',
      dataIndex: 'imagen',
      key: 'imagen',
      render: (_, item, indice) => (
        <ImgCrop>
          <Upload
            gutter={4}
            fileList={arrImagenes[indice] || []}
            beforeUpload={() => true}
            action=""
            listType="picture-card"
            maxCount={1}
            onChange={(e) => cambioImg(e, indice)}
            multiple={false}
          >
            <Button
              type='text'
            >
              Elegir Imagen
            </Button>
          </Upload>
        </ImgCrop>
      ),
    },
  ];

    // se procesa cada campo input de los productos y se gargan en la variable de estado
  const cambio = (nombre, indice, valor) => {
    //creamos copia de estado de tabla
    let _productos = [...productosTabla]

    //acceder al Indice y cambiar valor
    if (nombre === "cantidad" || nombre === "monto") {
      _productos[indice][nombre] = parseFloat(valor)
    } else {
      _productos[indice][nombre] = valor
    }

    console.log("_productos: ", _productos)

    // arreglo de productos
    setProductosTabla(_productos);
    // pasamos estado a calculo de tabla
    calcularSubtotal(productosTabla);
  }

  const calcularSubtotal = (item) => {
    //hay que pasar cada monto de cada producto, sumarlo y mostrar en un input o label
    let _subTotal = item
    let prod = 0;
    let suma = 0;
    let _iva = 0;
    let _total = 0;

    // console.log(_subTotal)
    for (let i = 0; i < _subTotal.length; i++) {
      //accedemos a posicion "monto"
      if (_subTotal[i]?.cantidad === 1) {
        prod = _subTotal[i]?.monto
      } else {
        prod = _subTotal[i]?.monto * _subTotal[i]?.cantidad
      }
      suma = prod + suma;
    }
    setSubTotal(suma);

    //calculo iva
    _iva = suma * 0.16
    setIva(_iva);

    //calculo total
    _total = suma + _iva;
    setTotal(_total)
  }

  //use Calllback
  const setCopia = React.useCallback(() => {
    setCopiaModel(model)
  }, [model]);

  // useCallback para setear cambio de imagenes
  const cambioImagenes = React.useCallback(()=>{
    let _arreglo = [];
    for (let i = 0; i < copiaModel?.cotizacionProductos.length; i++) {
      // le seteamos campo thumbUrl a cada elemento
      _arreglo[i] = [{thumbUrl: copiaModel?.cotizacionProductos[i].imagen}]
    }
    setArrImagenes(_arreglo)
    
  },[copiaModel])
  
  
  // useCallback para guardar valor de SubTotal
  const editandoSubtotal = React.useCallback(()=>{
    let _subTotal = model?.cotizacionProductos
    let prod = 0;
    let suma = 0;
    let _iva = 0;
    let _total = 0;
    
    // console.log(_subTotal)
    for (let i = 0; i < _subTotal.length; i++) {
      //accedemos a posicion "monto"
      if(_subTotal[i]?.cantidad === 1){
        prod = _subTotal[i]?.monto
      }else{
        prod = _subTotal[i]?.monto * _subTotal[i]?.cantidad
      }
      suma = prod + suma;
    }
    setSubTotal(suma);

    //calculo iva
    _iva = suma * 0.16
    setIva(_iva);

    //calculo total
    _total = suma + _iva;
    setTotal(_total)
  },[model?.cotizacionProductos])
  

  // Arreglo donde deben almacenarse lista de productos
  const insertarEnArreglo = () => {
    let _obj = {
      id: productosTabla.length+1,
      producto: '',
      monto: '',
      cantidad: '',
      imagen: ''
    }
    setProductosTabla([...productosTabla, _obj])
  };

  //cambio de Imagen
  const cambioImg = async (item, indice) => {
    let _imagenes = [...arrImagenes];
    _imagenes[indice] = item?.fileList
    setArrImagenes(_imagenes)
    let nuevaImagen = await toBase64(item?.fileList[0]?.originFileObj);
    cambio('imagen', indice, nuevaImagen)
  }

  const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
    }
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  const eliminarProducto = (item) => {

    const _producto = productosTabla.find(producto => producto.id === item?.id)
    
    let _productosRestantes = [...productosTabla];
    
    let _arregloImagenes = arrImagenes;
    for (let i = 0; i < _productosRestantes.length; i++) {
      if (_productosRestantes[i].id === _producto.id) {
        _productosRestantes.splice(i, 1)
        _arregloImagenes.splice(i, 1)
        break
      }
    }
    setProductosTabla(_productosRestantes);
    for (let ind = 0; ind < _arregloImagenes.length; ind++) {
      const element = _arregloImagenes[ind];
      console.log(element)
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    // res es un objeto que contiene
    const {
      vigencia
    } = values;

    let body = {
      ...values,
      productos: productosTabla,
    }
    
    if(editing) {
      body.id = id;
      body.vigencia = moment(vigencia).format("YYYY-MM-DD");
    }
    //inicio de try catch antes de StatusResponse
    try {
      const res = await httpService.post('v1/cotizacion', body);
    
      if (res) {
        //Si estatus 400 y "errores" es diferente a nulo
        if (res?.status === 400 && res?.errores !== null) {
          const newArray = Object.values(res?.errores);
          Modal.error({
            title: res?.mensaje,
            content: (
              <div>{newArray.map((m, i) =>
                <span key={(i + 1)}> -{m} <br />
                </span>)
              }</div>
            )
          });
          //cuando el dato ya existe no se puede guardar en BD
        } else if (res?.status === 400 && res?.errores === null) {
          message.error({
            content: res?.mensaje,
            style: { marginTop: '20vh' },
          });
          //todo salió bien
        } else if (res?.status === 200) {
          message.success({
            content: res?.mensaje,
            style: { marginTop: '20vh' }
          });
          navigate('/cotizaciones');
        }
      }
    } catch (e) {
      console.log('Error al guardar: ', e);
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = ({ values, errorFields, outOfDate }) => {
    message.warning('Error al guardar: datos incompletos.');
    console.log(values, errorFields, outOfDate);
  };
  
  useEffect(() => {
    setRequest({
      name: 'v1/cotizacion',
      id: id,
      expand: "cotizacionProductos,empresa,cliente"
    })
    return () => {
      setRequest({})
    }
  }, [id]);

  useEffect(() => {
    if (empresaValue && empresaValue !== null) {
      setOpenEmpresa(false);
    }
  }, [empresaValue])

  useEffect(() => {
    if (clienteValue && clienteValue !== null) {
      setOpenCliente(false);
    }
  }, [clienteValue])

  useEffect(() => {
    setCopia()
  }, [setCopia])

  useEffect(() => {
    if (editing && model) {
      setProductosTabla(model?.cotizacionProductos)
      form.setFieldsValue({
        ...model,
        cliente: model?.cliente?.nombre,
        empresa: model?.empresa?.nombre,
        vigencia: moment(model?.vigencia),
        productos: model?.cotizacionProductos
      })
      // para que funcione vista de elementios en ImgCrop en caso de edición 
      cambioImagenes()
      editandoSubtotal()
    }
  }, [cambioImagenes, editandoSubtotal, editing, form, model])

  return (
    <DefaultLayout
      btnGroup={{ btnGroup }}
      cotizacionInfo={editing ? cotizacionInfo : null}
    >
      <Form
        form={form}
        name="form"
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Modal
          title="Introducir nueva empresa"
          centered
          open={openEmpresa}
          footer={false}
          onCancel={() => setOpenEmpresa(false)}
          width='80vw'
        >
          <EmpresaDetalle
            setEmpresaValue={setEmpresaValue}
          />
        </Modal>

        <Modal
          title="Introducir nuevo cliente"
          centered
          open={openCliente}
          footer={false}
          onCancel={() => setOpenCliente(false)}
          width='80vw'
        >
          <ClienteForm
            setClienteValue={setClienteValue}
          />

        </Modal>

        <Row gutter={10}>
          {!editing && (
            <>
              <Col
                xs={{span: 22}}
                sm={{span: 22}}
                lg={{span: 10}}
                xxl={{span: 10}}
              >
                <Form.Item
                  label="Empresa"
                  name="idEmpresa"
                  rules={[{ required: true, message: 'Requerido' }]}
                >
                  <Select
                    showSearch
                    modelsParams={requestEmpresa}
                    labelProp={'nombre'}
                    valueProp={'id'}
                    autoComplete={"off"}
                    placeholder={'Selecciona Empresa'}
                    render={(_, row) => `${row?.nombre}`}
                    append={[empresaValue]}
                  />
                </Form.Item>
              </Col>

              <Col span={2}>
                <Form.Item label="&nbsp;">
                  <Tooltip title="Agregar una Empresa">
                    <Button
                      block
                      onClick={() => setOpenEmpresa(true)}
                      icon={<PlusCircleOutlined />}
                    />
                  </Tooltip>
                </Form.Item>
              </Col>

              <Col
                xs={{ span: 22 }}
                sm={{ span: 22 }}
                lg={{ span: 10 }}
                xxl={{ span: 10 }}
              >
                <Form.Item
                  label="Cliente"
                  name="idCliente"
                >
                  <Select
                    showSearch
                    modelsParams={requestCliente}
                    placeholder={'Selecciona Cliente'}
                    labelProp={'nombre'}
                    valueProp={'id'}
                    render={(_, row) => `${row?.nombre}`}
                    append={[clienteValue]}
                  >
                  </Select>
                </Form.Item>
              </Col>

              <Col span={2}>
                <Form.Item label="&nbsp;">
                  <Tooltip title="Agregar un Cliente" >
                    <Button
                      block
                      onClick={() => setOpenCliente(true)}
                      icon={<PlusCircleOutlined />}
                    />
                  </Tooltip>
                </Form.Item>
              </Col>
            </>
          )}

          {!editing ? (
            <Col
              className="gutter-row"
              xs={24}
              sm={24}
              md={12}
              lg={12}
              xxl={12}
            >
              <Form.Item
                label="Estatus"
                name="estatus"
                initialValue="NUEVA"
              >
                <Select
                  disabled
                >
                  <Option value="NUEVA">NUEVA</Option>
                  <Option value="VENDIDA">VENDIDA</Option>
                  <Option value="CANCELADA">CANCELADA</Option>
                </Select>
              </Form.Item>
            </Col>
          ) : (
            <Col
              className="gutter-row"
              xs={24}
              sm={24}
              md={12}
              lg={12}
              xxl={12}
            >
              <Form.Item
                label="Estatus"
                name="estatus"
                initialValue="NUEVA"
              >
                <Select
                >
                  <Option value="NUEVA">NUEVA</Option>
                  <Option value="VENDIDA">VENDIDA</Option>
                  <Option value="CANCELADA">CANCELADA</Option>
                </Select>
              </Form.Item>
            </Col>
          )}

          <Col
            className="gutter-row"
            xs={24}
            sm={24}
            md={12}
            lg={12}
            xxl={12}
          >
            <Form.Item
              label="Condiciones"
              name="condiciones"
            >
              <Input
                placeholder="Escribir Condiciones"
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
              label="Factura"
              name="factura"
            >
              <Input
                placeholder="Escribir Factura"
                autoComplete="off"
                disabled
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
              label="Vigencia"
              name="vigencia"
            >
              <DatePicker
                locale={locale}
                format='DD-MM-YYYY'
              />
            </Form.Item>
          </Col>

        </Row>
        <Row>

          <Col>
            <Form.Item label="&nbsp;">
              <Button onClick={() => {
                console.log(productosTabla)
                insertarEnArreglo()
              }}>
                Agregar Producto
              </Button>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={{ xs: 10, sm: 10, md: 10, lg: 10 }}>
          <Table
            dataSource={productosTabla}
            rowKey={'id'}
            columns={columns}
            size='middle'
            scroll={{ x: 1000 }}
            pagination={false}
          />
        </Row>
        <div
          style={{
            paddingRight: 300
          }}>
          <Row justify='end'>
            <Col>
              <p><strong>Sub-Total: </strong>{new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(subTotal)}</p>
            </Col>
          </Row>
          <Row justify='end'>
            <Col>
              <p><strong>IVA: </strong>{new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(iva)}</p>
            </Col>
          </Row>
          <Row justify='end'>
            <Col>
              <p><strong>Total: </strong>{new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(total)}</p>
            </Col>
          </Row>
        </div>

        <Row gutter={10}>
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
                loading={loading}
                icon={<SaveOutlined />}
              >Guardar
              </Button>
            </Form.Item>
          </Col>
        </Row>

      </Form>
    </DefaultLayout>
  )
}

export default CotizacionDetalle