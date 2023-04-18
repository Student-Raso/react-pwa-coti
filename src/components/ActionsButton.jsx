import React from "react";
import PropTypes from "prop-types";
import { Button, Dropdown } from "antd";
import { MoreOutlined } from "@ant-design/icons";

const ActionsButton = ({ data = [] }) => {
  const [items, setItems] = React.useState([]);

  React.useEffect(() => {
    if (data.length < 1) return;
    const arr = [];
    data.forEach((i) => {
      arr.push({ ...i });
    });

    setItems(data);
  }, [data]);

  return (
    <Dropdown menu={{ items }} placement="bottomLeft">
      <Button>
        <MoreOutlined />
      </Button>
    </Dropdown>
  );
};

ActionsButton.propTypes = {
  data: PropTypes.array.isRequired,
};

export default ActionsButton;
