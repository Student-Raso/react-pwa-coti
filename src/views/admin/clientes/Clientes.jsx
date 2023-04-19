import React, {useRef} from 'react'
import {Link, useNavigate} from "react-router-dom";
import {eliminarRegistro} from "../../../utilities";
import {PlusOutlined} from "@ant-design/icons";
import {ActionsButton, Tabla} from "../../../components";
import {SimpleTableLayout} from "../../../components/layouts";

const Clientes = () => {


  const endPoint = "v1/cliente";
  const tablaRef = useRef(null);
  const navigate = useNavigate();
  const [buscarValue, setBuscarValue] = React.useState('');
  const url = 'administracion/clientes';

  const btnGroup = [
    {
      onClick: () => {
        navigate(`/${url}/agregar`)
      },
      props: {disabled: false, type: 'primary', block: false},
      text: 'Agregar',
      icon: <PlusOutlined/>,
    },
  ];


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
              onClick: () => {
                navigate(`/${url}/detalle?id=${item?.ID_vinculo}`)
              },
            },
            {
              label: "Eliminar",
              onClick: () => {
                eliminarRegistro(`vinculo ${item?.vin_nombre_corral}`, item?.ID_vinculo, endPoint,() => tablaRef?.current?.refresh())
              },
              danger: true,
            },
          ]}
        />
      ),
    },
    {
      title: 'Id',
      key: 'id',
      dataIndex: 'id',
      render: (_, item) => (
        <Link to={`/${url}/detalle?id=${item?.id}`} style={{color: "black"}}>
          {item?.id}
        </Link>
      )
    },
    {
      title: 'Nombre',
      key: 'nombre',
      dataIndex: 'nombre',
      render: (_, item) => (
        <Link to={`/${url}/detalle?id=${item?.id}`} style={{color: "black"}}>
          {item?.nombre}
        </Link>
      )
    },
    {
      title: 'Responsable',
      key: 'responsable',
      dataIndex: 'responsable',
      render: (_, item) => (
        <Link to={`/${url}/detalle?id=${item?.id}`} style={{color: "black"}}>
          {item?.responsable}
        </Link>
      )
    }
  ]

  const onSearch = (value) => {
    setBuscarValue(value);
  }

  return <SimpleTableLayout
    onSearch={onSearch}
    btnGroup={{btnGroup}}>
    <Tabla
      nameURL={endPoint}
      columns={columns}
      innerRef={tablaRef}
      order={'id'}
      extraParams={{ q: buscarValue, expand: '' }}
    />
  </SimpleTableLayout>;
}

export default Clientes