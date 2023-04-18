import React, {useRef} from 'react'
import {Link, useNavigate} from "react-router-dom";
import {eliminarRegistro} from "../../utilities";
import {PlusOutlined} from "@ant-design/icons";
import {ActionsButton, Tabla} from "../../components";
import {SimpleTableLayout} from "../../components/layouts";

const Vinculos = () => {


  const endPoint = "v1/vinculo";
  const tablaRef = useRef(null);
  const navigate = useNavigate();
  const [buscarValue, setBuscarValue] = React.useState('');

  const btnGroup = [
    {
      onClick: () => {
        navigate(`/psg/agregar`)
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
                navigate(`/psg/detalle?id=${item?.ID_vinculo}`)
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
      title: 'Clave',
      key: 'vin_num_psg',
      dataIndex: 'vin_num_psg',
      render: (_, item) => (
        <Link to={`/psg/detalle?id=${item?.ID_vinculo}`} style={{color: "black"}}>
          {item?.vin_num_psg}
        </Link>
      )
    },
    {
      title: 'Nombre',
      key: 'vin_nombre_corral',
      dataIndex: 'vin_nombre_corral',
      render: (_, item) => (
        <Link to={`/psg/detalle?id=${item?.ID_vinculo}`} style={{color: "black"}}>
          {item?.vin_nombre_corral}
        </Link>
      )
    },
    {
      title: 'Empresa',
      key: 'vin_nombre_corral',
      dataIndex: 'vin_nombre_corral',
      render: (_, item) => (
        <Link to={`/psg/detalle?id=${item?.ID_vinculo}`} style={{color: "black"}}>
          {item?.empresa?.nombre}
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
      order={'ID_vinculo'}
      extraParams={{ q: buscarValue, expand: 'empresa' }}
    />
  </SimpleTableLayout>;
}

export default Vinculos