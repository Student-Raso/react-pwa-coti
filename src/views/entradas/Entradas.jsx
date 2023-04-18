import React from 'react'
import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {  } from 'react-router-dom';
import { SimpleTableLayout } from '../../components/layouts';
import {
  PlusOutlined,
  FileExcelOutlined,
  SearchOutlined,
  ClearOutlined,
  ArrowUpOutlined, 
  ArrowRightOutlined
} from "@ant-design/icons";
import { Tabla, ActionsButton } from '../../components';
import { reporteBase } from '../../utilities';
import httpService from '../../services/httpService';
import { Modal, Row, Col, Spin, Form, Tooltip } from 'antd';
import { eliminarRegistro } from '../../utilities';
import dayjs from 'dayjs';
import FiltrosComponent from '../../components/FiltrosComponent';

const Entradas = () => {
  const endPoint = "v1/entradas";
  const tablaRef = useRef(null);
  const navigate = useNavigate();
  const [ buscarValue, setBuscarValue ] = useState({});
  const [formFiltros] = Form.useForm();
  const [loadingExcel, setLoadingExcel] = useState(false);

  const btnGroup = [
    {
      id:1,
      onClick: () => onSearch(),
      props:{disabled: false, type: "default", block: true},
      text: "Buscar",
      icon: <SearchOutlined />
    },
    {
      id:2,
      onClick: () => {setBuscarValue({}); formFiltros.resetFields();},
      props:{disabled: false, type: "default", block: true },
      text: "Limpiar",
      icon: <ClearOutlined />
    },
    {
      id:3,
      onClick: () => { navigate(`/entradas/agregar`) },
      props: { disabled: false, type: 'primary', block: false },
      text: 'Agregar',
      icon: <PlusOutlined />,
    },
  ];

  const extraButtons = [
    {
      id:4,
      onClick: () => descargarExcel(),
      props: {disabled: false, type: 'default', loading: loadingExcel},
      text: "Excel",
      icon: <FileExcelOutlined/>
    },
  ]

  const infoToExport = async() => {

    let obj = {
      expand: 'logsEntradas,vinculo'
    };
    let flag = true;
    let pagina = 1, total = 0, limite = 100;
    let registros = [];
    setLoadingExcel(true);

    while (flag) {
      obj["pagina"] = pagina;
      obj["limite"] = limite;
      const params = new URLSearchParams(obj).toString();
      const { resultado, paginacion } = await httpService.get(`${endPoint}?${params}`);
      registros = [
        ...registros,
        ...resultado
      ];
      
      total = paginacion.total
      const actual = pagina * limite;
      pagina = paginacion?.pagina + 1;

      if (total < actual) {
        flag = false; 
        setLoadingExcel(false);
      }
    }

    registros.forEach(m => {
      let _psg = m?.vinculo?.vin_nombre_corral;
      m.psg = _psg
    })
    return registros;
  }

  const descargarExcel = async() => {

    columns.splice(0, 1);
    let columnasExcel = columns
    columnasExcel.forEach(element => {
      delete element.render
      delete element.sortOrder
      delete element.ID_vinculo
    });

    columnasExcel.push({
      title: "PSG",
      key: "psg",
      dataIndex: "psg"
    })

    await reporteBase(
      columnasExcel,  // columnas
      await infoToExport(), // informacion de filas
      "reporte_entradas_"+dayjs().format('DD-MM-YYYY'),  // nombre del archivo
      "Reporte de entradas", // titulo
      `Fecha de descarga: ${dayjs().format('DD-MM-YYYY')}`, // subtitulo
      "/assets/logo-sarapha.png", // img
    )
  }

  const columns = [
    {
      title: "Acciones",
      key: "id",
      dataIndex: "id",
      width: 100,
      align: "center",
      orden: false,
      render: (_, item) => (
        <ActionsButton
          data={[
            {
              label: "Editar",
              onClick: () => { navigate(`/entradas/editar?id=${item?.id}`) },
            },
            {
              label: "Eliminar",
              onClick: () => eliminarRegistro(`entrada ${item?.ID_entrada}`, item?.ID_entrada, endPoint,()=>tablaRef.current.refresh()),
              danger: true,
            },
          ]}
        />
      ),
    },{
      key: 'idSalida',
      dataIndex: 'idSalida',
      render: (_, item) => (

        item?.idSalida ? 
        <Link to ={`/entradas/editar?id=${item?.ID_entrada}`} style={{color:"red", fontWeight: "bold", fontSize: '20px'}}>
          <Tooltip title={`fecha salida: ${dayjs(item?.salida?.sal_fecha).format('DD/MM/YYYY')}`}>{<ArrowUpOutlined />}</Tooltip>
        </Link>
        :
        <Link to ={`/entradas/editar?id=${item?.ID_entrada}`} style={{color:"green", fontWeight:"bold", fontSize: '20px'}}>
          <Tooltip title={`fecha entrada: ${dayjs(item?.ent_fecha_entrada).format('DD/MM/YYYY')}`}>{<ArrowRightOutlined />}</Tooltip>
        </Link>
      )
    },
    {
      title: 'ID Entrada',
      key: 'ID_entrada',
      dataIndex: 'ID_entrada',
      render: (_, item) => (
        <Link to ={`/entradas/editar?id=${item?.ID_entrada}`} style={{color:"black"}}>
          {item?.ID_entrada}
        </Link>
      )
    },
    {
      title: 'N° Animal',
      key: 'ent_num_animal',
      dataIndex: 'ent_num_animal',
      render: (_, item) => (
        <Link to ={`/entradas/editar?id=${item?.ID_entrada}`} style={{color:"black"}}>
          {item?.ent_num_animal}
        </Link>
      )
    },
    {
      title: 'Arete SINIIGA:',
      key: 'ent_arete_siniiga',
      dataIndex: 'ent_arete_siniiga',
      render: (_, item) => (
        <Link to ={`/entradas/editar?id=${item?.ID_entrada}`} style={{color:"black"}}>
          {item?.ent_arete_siniiga}
        </Link>
      )
    },
    {
      title: 'Arete Particular',
      key: 'ent_arete_particular',
      dataIndex: 'ent_arete_particular',
      render: (_, item) => (
        <Link to ={`/entradas/editar?id=${item?.ID_entrada}`} style={{color:"black"}}>
          {item?.ent_arete_particular}
        </Link>
      )
    },
    {
      title: 'Sexo',
      key: 'ent_sexo',
      dataIndex: 'ent_sexo',
      render: (_, item) => (
        <Link to ={`/entradas/editar?id=${item?.ID_entrada}`} style={{color:"black"}}>
          {item?.ent_sexo}
        </Link>
      )
    },
    {
      title: 'N° corral',
      key: 'ent_num_corral',
      dataIndex: 'ent_num_corral',
      render: (_, item) => (
        <Link to ={`/entradas/editar?id=${item?.ID_entrada}`} style={{color:"black"}}>
          {item?.ent_num_corral}
        </Link>
      )
    },
    {
      title: 'Fecha',
      key: 'ent_fecha_entrada',
      dataIndex: 'ent_fecha_entrada',
      render: (_, item) => (
        <Link to ={`/entradas/editar?id=${item?.ID_entrada}`} style={{color:"black"}}>
          {dayjs(item?.ent_fecha_entrada).format('DD/MM/YYYY')}
        </Link>
      )
    },
    {
      title: 'N° de Permiso Estatado',
      key: 'ent_num_permiso_entrada',
      dataIndex: 'ent_num_permiso_entrada',
      render: (_, item) => (
        <Link to ={`/entradas/editar?id=${item?.ID_entrada}`} style={{color:"black"}}>
          {item?.ent_num_permiso_entrada}
        </Link>
      )
    },
    {
      title: 'Num. Guia de Transito',
      key: 'ent_num_guia_transito',
      dataIndex: 'ent_num_guia_transito',
      render: (_, item) => (
        <Link to ={`/entradas/editar?id=${item?.ID_entrada}`} style={{color:"black"}}>
          {item?.ent_num_guia_transito}
        </Link>
      )
    },
    {
      title: 'Num. Guia de REEMO',
      key: 'ent_num_guia_reemo',
      dataIndex: 'ent_num_guia_reemo',
      render: (_, item) => (
        <Link to ={`/entradas/editar?id=${item?.ID_entrada}`} style={{color:"black"}}>
          {item?.ent_num_guia_reemo}
        </Link>
      )
    },
    {
      title: 'Constancia de Tratamiento Garrapaticida',
      key: 'ent_CTG',
      dataIndex: 'ent_CTG',
      render: (_, item) => (
        <Link to ={`/entradas/editar?id=${item?.ID_entrada}`} style={{color:"black"}}>
          {item?.ent_CTG}
        </Link>
      )
    },
    {
      title: 'Estado de Origen',
      key: 'ent_estado_origen',
      dataIndex: 'ent_estado_origen',
      render: (_, item) => (
        <Link to ={`/entradas/editar?id=${item?.ID_entrada}`} style={{color:"black"}}>
          {item?.ent_estado_origen}
        </Link>
      )
    },
    {
      title: 'Num. Certificado Zoosanitario',
      key: 'ent_num_cert_zoosanitario',
      dataIndex: 'ent_num_cert_zoosanitario',
      render: (_, item) => (
        <Link to ={`/entradas/editar?id=${item?.ID_entrada}`} style={{color:"black"}}>
          {item?.ent_num_cert_zoosanitario}
        </Link>
      )
    },
    {
      title: 'Num. Dictamen Negativo de TB',
      key: 'ent_num_dnTB',
      dataIndex: 'ent_num_dnTB',
      render: (_, item) => (
        <Link to ={`/entradas/editar?id=${item?.ID_entrada}`} style={{color:"black"}}>
          {item?.ent_num_dnTB}
        </Link>
      )
    },
    {
      title: 'Num. Dictamen Negativo de BR',
      key: 'ent_num_dnBR',
      dataIndex: 'ent_num_dnBR',
      render: (_, item) => (
        <Link to ={`/entradas/editar?id=${item?.ID_entrada}`} style={{color:"black"}}>
          {item?.ent_num_dnBR}
        </Link>
      )
    },
    {
      title: 'Num. Dictamen Negativo de TB',
      key: 'ent_arete_particular',
      dataIndex: 'ent_arete_particular',
      render: (_, item) => (
        <Link to ={`/entradas/editar?id=${item?.ID_entrada}`} style={{color:"black"}}>
          {item?.ent_arete_particular}
        </Link>
      )
    },
    {
      title: 'ID PSG',
      key: 'ID_vinculo',
      dataIndex: 'ID_vinculo',
      render: (_, item) => (
        <Link to ={`/entradas/editar?id=${item?.ID_entrada}`} style={{color:"black"}}>
          {item?.vinculo?.ID_vinculo}
        </Link>
      )
    },
    {
      title: 'Nombre Corral',
      key: 'vin_nombre_corral',
      dataIndex: 'vin_nombre_corral',
      render: (_, item) => (
        <Link to ={`/entradas/editar?id=${item?.ID_entrada}`} style={{color:"black"}}>
          {item?.vinculo?.vin_nombre_corral}
        </Link>
      )
    },
    {
      title: 'PSG',
      key: 'vin_num_psg',
      dataIndex: 'vin_num_psg',
      render: (_, item) => (
        <Link to ={`/entradas/editar?id=${item?.ID_entrada}`} style={{color:"black"}}>
          {item?.vinculo?.vin_num_psg}
        </Link>
      )
    },
  ]

  const onSearch = () => {
    const values = formFiltros.getFieldsValue(true);
    let params = { ...buscarValue };
    const { buscar, rangofechas } = values;

    if(rangofechas && rangofechas[0] && rangofechas[1] ){
      params.fechaInicio = dayjs(rangofechas[0]).startOf('day').format();
      params.fechaFin = dayjs(rangofechas[1]).endOf('day').format();
    }else{
      delete params.fechaInicio;
      delete params.fechaFin;
    }
    if (buscar) {
      params.q = buscar
    } else {
      delete params.q;
    }

    setBuscarValue(params)
  }

  return (
  <SimpleTableLayout
  customRender={
    <FiltrosComponent
      formFiltros={formFiltros}
      btnGroup={{
        btnGroup,
        flex: { justifyContent: "end", flexDirection: "row" },
      }}
      extraButtons={extraButtons}
    />}>
    <Tabla
      nameURL={endPoint}
      columns={columns} 
      innerRef={tablaRef}
      order={'ID_entrada-desc'}
      extraParams={buscarValue}
      expand='vinculo, salida'
      />
      <Modal
        open={loadingExcel}
        footer={null}
        closable={false}
      >
        <Row justify="center">
          <Col>
            <Spin spinning={loadingExcel} tip='Obteniendo entradas...' size="large" />
          </Col>
        </Row>
      </Modal>
    </SimpleTableLayout>
  );
}

export default Entradas;
