import React, { useRef, useState } from 'react'
import { PlusOutlined } from "@ant-design/icons";
import { Tabla } from '../../../components';
import { SimpleTableLayout } from '../../../components/layouts'
import { ActionsButton } from '../../../components';
import { lastPathName, eliminarRegistro, linkText } from "../../../utilities";
import { useNavigate } from 'react-router-dom';
import { Image } from "antd"

const ProductoListado = () => {

  const endPoint = "v1/cotizacion-producto";

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
    { title: "Nombre", key: "producto", dataIndex: "producto", render: newTextLink},
    { title: "Monto Unitario", key: "monto", dataIndex: "monto", render: newTextLink},
    { title: "Cantidad", key: "cantidad", dataIndex: "cantidad", render: newTextLink},
    { title: "Imagen", key: "imagen", dataIndex: "imagen", 
      render: (_, item) => (
        <Image
          height={50}
          placeholder="/assets/imagen-no-disponible.png"
          src={`${item?.imagen}`}
        />
      )
    }
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

export default ProductoListado