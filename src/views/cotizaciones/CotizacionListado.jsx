import React, { useState } from "react";
import { Image } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { SimpleTableLayout } from "../../components/layouts";
import { ActionsButton, Tabla } from "../../components";
import { abrirArchivo, eliminarRegistro } from "../../utilities";

import {
  EditOutlined, 
  PlusOutlined,
  InfoCircleOutlined,
  DeleteOutlined,
  PrinterOutlined,
  AuditOutlined,
  FileExcelOutlined
} from "@ant-design/icons";

const baseUrl = import.meta.env.VITE_API_URL;

const CotizacionListado = () => {

  let tablaRef = React.useRef(null);

  const navigate = useNavigate();

  const endPoint = 'v1/cotizacion';
  const [ buscarValue, setBuscarValue ] = useState('');
  const basePdf = `${baseUrl}/pdf/`

  const btnGroup = [
    {
      id: 2,
      onClick: e => console.log(e),
      props: { disabled: false, type: 'dashed'},
      text: 'Excel',
      icon: <FileExcelOutlined/>
    },
    {
      id: 1,
      onClick: () => navigate('cotizaciones/nuevo'),
      props: { disabled: false, type: 'primary' },
      text: 'Agregar',
      icon: <PlusOutlined />,
    }
  ];

  const onPrint = async(item) => {

    const urlPdf = `${basePdf}cotizacion?id=${item.id}`
    abrirArchivo(urlPdf)
  }

  const defaultText = prop => prop || <span style={{color: '#c7c3c3'}}>---</span>;

  const columns = [

    {
      title: 'Acciones',
      dataIndex: 'Acciones',
      key: 'Acciones',
      width: 120,
      align: 'center',
      render: (_, item) => (
        <ActionsButton
          key={item.id}
          text={"Acción"}
          options={[
            {
              name: 'Editar',
              icon: <EditOutlined/>,
              onClick: () =>  {navigate(`/cotizaciones/editar?id=${item.id}`)}
            },
            {
              name: 'Ver Información',
              icon: <InfoCircleOutlined />,
              onClick: () => console.log(item)
            },
            {
              name: 'Imprimir PDF',
              icon: <PrinterOutlined />,
              onClick: () => onPrint(item),
            },
            {
              name: 'Facturar',
              icon: <AuditOutlined/>,
              onClick: () =>  {navigate(`/facturaciones/facturar-cotizacion?idCotizacion=${item.id}`)}
            },
            {
              name: 'Eliminar',
              icon: <DeleteOutlined />,
              onClick: () => {
                eliminarRegistro(item?.folio, item?.id, endPoint, () => {
                  tablaRef?.current?.refresh()
                })
              },
              styleProps: { color: '#ff4d4f' }
            }
          ]}
        />
      )
    },
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (item) => item ? item : defaultText
    },
    {
      title: 'Folio',
      dataIndex: 'folio',
      key: 'folio',
      render: defaultText,
    },
    {
      title: 'Cliente',
      dataIndex: 'cliente',
      key: 'cliente',
      render: (item) => item?.nombre ? item?.nombre : defaultText,
    },
    {
      title: 'Empresa',
      dataIndex: 'empresa',
      key: 'empresa',
      render: (item) => item?.nombre ? item?.nombre : defaultText,
    },
    {
      title: 'Vigencia',
      dataIndex: 'vigencia',
      key: 'vigencia',
      render: defaultText,
    },
    {
      title: 'Estatus',
      dataIndex: 'estatus',
      key: 'estatus',
      render: (item) =>        
        (item==='NUEVA'&&(<><Image 
          width={50}
          src='https://cdn-icons-png.flaticon.com/128/2174/2174475.png'
          preview={false}
        /><p>{item}</p></>)) || (item==='VENDIDA'&&(<><Image 
          width={50}
          src='https://cdn-icons-png.flaticon.com/128/639/639365.png'
          preview={false}
        /><p>{item}</p></>)) || (item==='CANCELADA'&&(<><Image 
          width={50}
          src='https://cdn-icons-png.flaticon.com/128/8330/8330756.png'
          preview={false}
        /><p>{item}</p></>))
    },

  ];

  return (
    <SimpleTableLayout
    onSearch={setBuscarValue}
    btnGroup={{btnGroup}}
    >
      <Tabla
        innerRef={tablaRef}
        nameURL={endPoint}
        extraParams={{ buscar: buscarValue }}
        columns={columns}
        expand='cliente,empresa'
        scroll={{  x: 'width: 30vw' }}
      />
    </SimpleTableLayout>
  )
}

export default CotizacionListado