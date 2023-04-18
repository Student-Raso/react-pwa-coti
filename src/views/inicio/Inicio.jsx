import React from "react";
import {
  ArrowLeftOutlined,
  CarOutlined,
  ClearOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Col, Input, Row, Table, Form, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { SimpleTableLayout } from "../../components/layouts";
import { ButtonGroup, FormItem, Select, ActionsButton } from "../../components";

const Inicio = () => {
  const navigate = useNavigate();

  const dataSource = [
    {
      key: "1",
      name: "Mike",
      age: 32,
      address: "10 Downing Street",
    },
    {
      key: "2",
      name: "John",
      age: 42,
      address: "10 Downing Street",
    },
  ];

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
  ];

  const btnGroup = [
    {
      id: 1,
      text: "Agregar",
      onClick: () => navigate("/perfil"),
      icon: <PlusOutlined />,
      props: { type: "default", block: false, },
    },
    {
      id: 2,
      text: "Volver",
      hide: true,
      onClick: () => console.log("hola 2"),
      icon: <ArrowLeftOutlined />,
      props: { type: "default", block: false },
    },
    {
      id: 3,
      onClick: () => console.log("hola 3"),
      icon: <CarOutlined />,
      props: { type: "primary", block: false, danger: true },
    },
    {
      id: 3,
      onClick: () => console.log("hola 3"),
      icon: <ClearOutlined />,
      props: { type: "dashed", block: false },
    },
  ];

  const dataSelect = [
    {
      // id: 1, 
      idUsuario: 'uno',
      // name: 'Luis',
      nombre: 'Luis Hernandez'
    },
    {
      // id: 2, 
      idUsuario: 'dos',
      // name: 'Donaldo',
      nombre: 'Donaldo Estrada'
    },
  ];

  const onSearch = async (search) => {
    console.log(search);
  };

  const onFinish = (values) => {
    console.log(values);
  };

  const BusquedaAvanzada = () => {
    return (
      <Form onFinish={onFinish} layout="vertical">
        <Row gutter={10}>
          <Col span={8}>
            <Form.Item name="buscar">
              <Input placeholder="buscar" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="fecha">
              <Input placeholder="fecha" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="tipo">
              <Input placeholder="tipo" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="estatus">
              <Input placeholder="estatus" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="categoria">
              <Input placeholder="categoria" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="fecha">
              <Input placeholder="categoria" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={0}>
          <Col>
            <Form.Item>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                Buscar
              </Button>
            </Form.Item>
          </Col>
          <Col>
            <ButtonGroup 
              data={{ 
                btnGroup,
                flex: {
                  justifyContent: "end",
                  flexDirection: "row"
                }
              }} 
            />
          </Col>
        </Row>
      </Form>
    );
  };
  
  const ComponenteEejemplo = () => {
    return (
      <Row gutter={[10, 10]}>
        <Col>
         <Input />
        </Col>
        <Col>
        <ActionsButton
          data={[
            {
              key: 1,
              label: 'Editar',
              onClick: () => console.log('hola')
            },
            {
              key: 2,
              label: 'Eliminar',
              onClick: () => console.log('eliminar'),
              danger: true
            },
          ]}
        />
        </Col>
      </Row>
    )
  };

  return (
    <SimpleTableLayout
      btnGroup={{
        btnGroup,
        flex: {
          justifyContent: "end",
          flexDirection: "row",
        },
      }}
      onSearch={onSearch}
      customRender={
        <>
          <BusquedaAvanzada />
          <ComponenteEejemplo />
        </>
      }
    >
      <Form>
        <Row gutter={10}>
          <Col span={8}>
            <FormItem label="Selecciona" hasFeedback={true}>
              <Select 
                allowClear
                showSearch
                data={dataSelect} 
                labelProp="nombre" 
                valueProp="idUsuario" 
              />
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="Nombre" hasFeedback={true} tooltip="asds">
              <Input />
            </FormItem>
          </Col>
        </Row>
      </Form>

      <Table size="small" dataSource={dataSource} columns={columns} />
    </SimpleTableLayout>
  );
};

export default Inicio;