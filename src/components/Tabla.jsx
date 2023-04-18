import React from 'react';
import { Table } from 'antd';
import { useModels, useSortColumns, usePagination } from '../hooks';
import PropTypes from "prop-types";

const Tabla = ({
  nameURL = "",
  expand = '',
  extraParams = null,
  columns,
  order,
  innerRef,
  scrollX = '80vw',
  ...props
}) => {

  const [columnsData, setColumnsData] = React.useState([]);
  const [request, setRequest] = React.useState({});

  const {
    limit,
    page,
    configPagination,
    setTotal,
  } = usePagination();

  const { sortValue, columnsContent } = useSortColumns({ columnsData, order: order || 'id-desc' });

  const requestParams = React.useMemo(() => {
    let obj = {
      name: nameURL || '',
      ordenar: sortValue,
      expand: expand || '',
      limite: limit,
      pagina: page
    }

    if (extraParams !== null) {
      obj.extraParams = extraParams
    }
    return obj
  }, [expand, extraParams, limit, nameURL, page, sortValue]);

  const {
    models,
    modelsLoading,
    modelsPage, 
    refresh
  } = useModels(request);


  React.useEffect(() => {
    setRequest(requestParams);
    return () => setRequest({});
  }, [requestParams]);

  React.useEffect(() => {
    setColumnsData(columns);
  }, [columns]);

  React.useEffect(() => {
    if (modelsPage) {
      setTotal(modelsPage?.total);
    }
  }, [modelsPage, setTotal]);

  if (innerRef) {
    innerRef.current = {
      refresh
    }
  }

  return (
    <Table
      {...props}
      dataSource={models}
      columns={columnsContent}
      rowKey={'id'}
      loading={modelsLoading}
      pagination={configPagination}
      style={{ whiteSpace: 'pre' }}
      scroll={{ x: scrollX }}
      size="small"
    />
  )
}

Tabla.propTypes = {
  nameURL: PropTypes.string.isRequired,
  columns: PropTypes.array.isRequired,
  expand: PropTypes.string,
  extraParams: PropTypes.object,
  order: PropTypes.string,
  scrollX: PropTypes.string,
}

export default Tabla