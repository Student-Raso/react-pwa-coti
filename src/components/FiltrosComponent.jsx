import React from "react";
import PropTypes from "prop-types";
import { Col, Form, Input, Row, DatePicker, Button } from "antd";
import ButtonGroup from "./ButtonGroup";
const { RangePicker } = DatePicker;

const FiltrosComponent = ({ btnGroup, formFiltros, extraButtons }) => {
  return (
    <Form form={formFiltros} layout="vertical">
      <Row gutter={10}>
        <Col
          xs={{ span: 24 }}
          sm={{ span: 24 }}
          md={{ span: 8 }}
          lg={{ span: 8 }}
        >
          <Form.Item label="Buscar" name="buscar">
            <Input placeholder="Escribir..." />
          </Form.Item>
        </Col>
        <Col
          xs={{ span: 24 }}
          sm={{ span: 24 }}
          md={{ span: 8 }}
          lg={{ span: 8 }}
        >
          <Form.Item label="Rango de Fechas" name="rangofechas">
            <RangePicker style={{width:'100%'}}/>
          </Form.Item>
        </Col>
        <Col
          xs={{ span: 24 }}
          sm={{ span: 24 }}
          md={{ span: 8 }}
          lg={{ span: 8 }}
        >
          <Form.Item label="&nbsp;">
            <ButtonGroup data={btnGroup} />
          </Form.Item>
        </Col>
      </Row>
      
      <Row gutter={15}>
        <Col
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 8 }}
            lg={{ span: 8 }}
          >
          </Col>
        <Col xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 8 }}
            lg={{ span: 8 }}>
          <></>
        </Col>
        <Col xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 8 }}
            lg={{ span: 8 }}
            style={{
              display: 'flex', 
              justifyContent: 'flex-end' 
            }}
            >
        {extraButtons?.map((item, index) => (
          <Col xs={{ span: 12 }}
          sm={{ span: 12 }}
          md={{ span: 12 }}
          lg={{ span: 12 }}
          >
            <Button
              key={`btnGroup-${index}`}
              onClick={item.onClick}
              style={{
                marginBottom: 10,
                marginTop:5,
                width: "100%"
              }}
              {...item.props}
            >
              {item.icon} {item.text}
            </Button>
            </Col>
        ))}
        </Col>
      </Row>
    </Form>
  );
};

FiltrosComponent.propTypes = {
  btnGroup: PropTypes.object,
  formFiltros: PropTypes.any.isRequired,
};

export default FiltrosComponent;
