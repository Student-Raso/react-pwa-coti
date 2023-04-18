import { Spin } from "antd";
import PropTypes from "prop-types";
import ButtonGroup from "../ButtonGroup";

const DefaultLayout = ({ children, btnGroup, viewLoading }) => {

  const text = viewLoading?.text || 'Cargando...';
  const size = viewLoading?.size || 'small' ;
  const spinning = viewLoading?.spinning || false;
  
  const styles = {
    content: {
      background: "#fff",
      padding: "10px 10px 10px 10px",
      borderRadius: 6,
      marginBottom: 10,
      marginTop: 10,
    },
    buttons: {
      background: "#fff",
      padding: 10,
      borderRadius: 6,
    },
  };

  return (
    <>
      <Spin spinning={spinning} tip={text} size={size}>
      {Boolean(btnGroup) && (
        <div style={ styles.buttons }>
          <ButtonGroup data={btnGroup} />
        </div>
      )}
      <div style={styles.content}>{children}</div>
    </Spin>
    </>
  );
};

DefaultLayout.propTypes = {
  children: PropTypes.any.isRequired,
  btnGroup: PropTypes.object,
};

export default DefaultLayout;
