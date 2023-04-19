import { Spin } from "antd";
import PropTypes from "prop-types";
import ButtonGroup from "../ButtonGroup";
import { Col } from "antd"

const DefaultLayout = ({ children, btnGroup, viewLoading, cotizacionInfo }) => {

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

  const estiloCol = {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    marginRight: 15,
  }

  return (
    <>
      <Spin spinning={spinning} tip={text} size={size}>
        {Boolean(cotizacionInfo) && (
          <>
            <Col style={estiloCol}>
              <p><strong>{cotizacionInfo.cotizacion}</strong>{cotizacionInfo.folio}</p>
            </Col>
            <Col style={estiloCol}>
              <p><strong>{cotizacionInfo.empresa}</strong>{cotizacionInfo.nombreEmpresa}</p>
            </Col>
            <Col style={estiloCol}>
              <p><strong>{cotizacionInfo.cliente}</strong>{cotizacionInfo.clienteNombre}</p>
            </Col>
          </>
        )

        }
        {Boolean(btnGroup) && (
          <div style={styles.buttons}>
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
