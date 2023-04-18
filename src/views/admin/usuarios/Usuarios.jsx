import React, {useRef} from 'react'
import {Link, useNavigate} from "react-router-dom";
import {eliminarRegistro, Roles} from "../../../utilities";
import {PlusOutlined} from "@ant-design/icons";
import {ActionsButton, Tabla} from "../../../components";
import {SimpleTableLayout} from "../../../components/layouts";

const Usuarios = () => {

  const endPoint = "v1/usuario";
  const tablaRef = useRef(null);
  const navigate = useNavigate();
  const [buscarValue, setBuscarValue] = React.useState('');

  const btnGroup = [
    {
      onClick: () => {
        navigate(`/administracion/usuarios/agregar`)
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
                navigate(`/administracion/usuarios/detalle?id=${item?.id}`)
              }
            },
            {
              label: "Eliminar",
              onClick: () => {
                eliminarRegistro(
                  item?.nombre, item?.id, endPoint,
                  () => tablaRef?.current?.refresh()
                )
              },
              danger: true,
            },
          ]}
        />
      ),
    },
    {
      title: 'Nombre',
      key: 'nombre',
      dataIndex: 'nombre',
      render: (_, item) => (
        <Link to={`/administracion/usuarios/detalle?id=${item?.id}`} style={{color: "black"}}>
          {item?.nombre}
        </Link>
      )
    },
    {
      title: 'Correo',
      key: 'correo',
      dataIndex: 'correo',
      render: (_, item) => (
        <Link to={`/administracion/usuarios/detalle?id=${item?.id}`} style={{color: "black"}}>
          {item?.correo}
        </Link>
      )
    },
  ]

  const onSearch = (value) => {
    setBuscarValue(value);
  }

  return (
    <SimpleTableLayout
      onSearch={onSearch}
      btnGroup={{ btnGroup }}>
      <Tabla
        nameURL={endPoint}
        columns={columns}
        innerRef={tablaRef}
        order={'id'}
        extraParams={{ q: buscarValue }}
      />
    </SimpleTableLayout>
  )
}

export default Usuarios