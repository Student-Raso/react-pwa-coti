import React, { useRef, useState } from 'react'
import { PlusOutlined } from "@ant-design/icons";
import { Tabla } from '../../../components'
import { SimpleTableLayout } from '../../../components/layouts'
import { ActionsButton } from '../../../components';
import { lastPathName, eliminarRegistro, linkText } from "../../../utilities";
import { useNavigate } from 'react-router-dom';
import { Image } from "antd"

const EmpresaListado = () => {

  const endPoint = "v1/empresa";
  
  let tablaRef = useRef(null);
  const navigate = useNavigate();
  const { lastPath } = lastPathName();
  const [buscarValue, setBuscarValue] = useState('');

  const onSearch = (search) => setBuscarValue(search);

  const botones = [
    {
      onClick: () => navigate(`/administracion/${lastPath}/detalle`),
      props: { disabled: false, type: "primary", block: false },
      text: "Nuevo",
      icon: <PlusOutlined />,
    },
  ];

  const newTextLink = (value, row, key) => 
    linkText(value, row, key, columns, lastPath);

  const columns = [
    {
      title: "Acciones",
      key: "id",
      dataIndex: "id",
      width: 100,
      align: "center",
      render: (_, item) => (
        <ActionsButton
          data={[
            {
              label: "Editar",
              onClick: () => navigate(`/administracion/empresas/detalle?id=${item.id}`),
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
    { title: "Nombre", key: "nombre", dataIndex: "nombre", render: newTextLink},
    { title: "Logo", key: "logo", dataIndex: "logo", 
    render: (_, item)=>(
      item?.logo
      ?
      <Image
        height={50}
        src={`${item?.logo}`}
      />
     :
      <Image
        height={50}
        src="/assets/imagen-no-disponible.png"
      />
    )
    },
    { title: "Corrreo", key: "correo", dataIndex: "correo", render: newTextLink}
  ];


  return (
    <SimpleTableLayout
      onSearch={onSearch}
      btnGroup={{
        btnGroup: botones,
      }}
    >
      <Tabla
        innerRef={tablaRef}
        columns={columns}
        nameURL={endPoint}
        extraParams={{ buscar: buscarValue || ''}}
        scroll={{ x: '30vw' }}
      />
    </SimpleTableLayout>
  )
}

export default EmpresaListado