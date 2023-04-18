import React from "react";
import PropTypes from "prop-types";
import { Form } from "antd";

const FormItem = ({ children, name, rules = [], errores = {}, ...props }) => {
  if (errores[name]) {
    rules.push({
      required: true,
      message: errores[name],
    });
  }

  return (
    <Form.Item name={name} rules={rules} {...props}>
      {children}
    </Form.Item>
  );
};

FormItem.propTypes = {
  children: PropTypes.any.isRequired,
  name: PropTypes.string,
  rules: PropTypes.array,
  errores: PropTypes.object,
};

export default FormItem;