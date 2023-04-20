import React, { useRef, useState } from 'react'
import { Tooltip } from 'antd';
import { PlusOutlined } from "@ant-design/icons";
import { Tabla } from '../../../components'
import { SimpleTableLayout } from '../../../components/layouts'
import { ActionsButton } from '../../../components';
import { lastPathName, eliminarRegistro, isEllipsis } from "../../../utilities";
import { Link, useNavigate } from 'react-router-dom';

const EmpresaListado = () => {

  const endPoint = "v1/empresa";
  
  let tablaRef = useRef(null);
  const navigate = useNavigate();
  const { lastPath } = lastPathName();
  const [buscarValue, setBuscarValue] = useState('');

  const onSearch = async (search) => {
    setBuscarValue(search);
  };

  const botones = [
    {
      onClick: () => navigate(`/administracion/${lastPath}/detalle`),
      props: { disabled: false, type: "primary", block: false },
      text: "Nuevo",
      icon: <PlusOutlined />,
    },
  ];

  const linkText = (value, row, key) => (
    <Link to={`/administracion/${lastPath}/detalle?id=${row.id}`}>
      {
        
        isEllipsis(columns, key)
          ? <Tooltip title={value}>
            {value}
          </Tooltip>
        : value
      }
    </Link>
  );

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
    { title: "Nombre", key: "nombre", dataIndex: "nombre", render: linkText },
    { title: "Telefono", key: "telefono", dataIndex: "telefono", render: linkText },
    { title: "Corrreo", key: "correo", dataIndex: "correo", render: linkText }
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