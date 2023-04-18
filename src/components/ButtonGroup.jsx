import React from "react";
import PropTypes from "prop-types";
import { Button } from "antd";

const ButtonGroup = ({ data }) => {
  const btnGroup = data?.btnGroup || [];
  const flex = {
    justifyContent: data?.flex?.justifyContent || "end",
    flexDirection: data?.flex?.flexDirection || "row",
  };

  const styles = {
    buttons: {
      background: "#fff",
      borderRadius: 6,
      display: "flex",
      justifyContent: flex.justifyContent,
      flexDirection: flex.flexDirection,
    },
    btn: {
      marginLeft: flex.justifyContent === "end" ? 10 : 0,
      marginRight: flex.justifyContent === "start" ? 10 : 0,
      marginBottom: flex.flexDirection === "column" ? 10 : 0,
    },
  };

  return (
    <div style={styles.buttons}>
      {btnGroup.length > 0 &&
        btnGroup.map((i, index) =>
          Boolean(i.hide)
            ? false
            : true &&
              (Boolean(i.text) ? (
                <Button
                  key={`btnGroup-${index}`}
                  onClick={i.onClick}
                  style={styles.btn}
                  {...i.props}
                >
                  {i.icon} {i.text}
                </Button>
              ) : (
                <Button
                  key={`btnGroup-${index}`}
                  onClick={i.onClick}
                  style={styles.btn}
                  icon={i.icon}
                  {...i.props}
                />
              ))
        )}
    </div>
  );
};

ButtonGroup.propTypes = {
  data: PropTypes.object.isRequired,
};

export default ButtonGroup;
