import React from 'react'
import PropTypes from "prop-types";
import { Select as AntdSelect, Tag } from 'antd'
import { useModels } from '../hooks';
import { agregarFaltantes } from '../utilities';

const Select = ({ 
  modelsParams, 
  labelProp, 
  valueProp, 
  render, 
  append, 
  deleteSelected,
  extraParams,
  ...props 
}) => {

  const [request, setRequest] = React.useState({});
  const [buscarValue, setBuscarValue] = React.useState('');
  const [timer, setTimer] = React.useState(null);
  

  const extraParamsMemo = React.useMemo(
    () => ({ buscar: buscarValue, ...extraParams, ...modelsParams?.extraParams  }),
    [buscarValue, extraParams, modelsParams?.extraParams]
  );

  const requestMemo = React.useMemo(() => ({
    name: modelsParams?.name || "",
    ordenar: modelsParams?.ordenar || `${valueProp}-desc`,
    limite: modelsParams?.limite || 20,
    expand: modelsParams?.expand || "",
    extraParams: extraParamsMemo,
  }), [extraParamsMemo, modelsParams, valueProp]);
  const {
    models,
    modelsLoading,
    modelsError
  } = useModels(request);

  const onSearch = (value) => {
    clearTimeout(timer);
    const newTimer = setTimeout(() => {
      setBuscarValue(value);
    }, 300);

    setTimer(newTimer);
  };

  const quitarDuplicados = (string) => {
    if(!string) return;
    const arr = String(string).split(',') || []
    const sinDuplicados = arr.filter((item, index)=> arr.indexOf(item) === index)
    return sinDuplicados.join(',')
  }

  if(!render) {
    render = (value) => value;
  }

  if (!append) {
    append = [];
  }


  React.useEffect(() => {
    setRequest(requestMemo);
    return () => {
      setRequest({});
    };
  }, [requestMemo]);


  if(modelsError) {
    return <Tag color='red'>error al obtener información de selector.</Tag>
  }

  return (
    <AntdSelect
      {...props}
      showSearch
      onSearch={onSearch}
      defaultActiveFirstOption={false}
      filterOption={false}
      notFoundContent={null}
      allowClear={true}
      style={{ width: '100%' }}
      loading={modelsLoading}
      options={ models?.length > 0 && 
        agregarFaltantes([...models], [...append], valueProp).map(i => ({
        ...i,
        label: render(i[labelProp], i),
        value: i[valueProp],
      }))}
    />
  )
}


Select.propTypes = {
  modelsParams: PropTypes.object.isRequired,
  labelProp: PropTypes.string.isRequired,
  valueProp: PropTypes.string.isRequired,
  render: PropTypes.func,
  append: PropTypes.array,
  notIn: PropTypes.string,
  onDeselected: PropTypes.func,
  deleteSelected: PropTypes.string,
};

export default Select