import { Spin } from "antd";
import PropTypes from "prop-types";
import ButtonGroup from "../ButtonGroup";
import { Col, Row, Typography } from "antd";
const { Text } = Typography;

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
    data: {
      background: "#fff",
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "left",
    }
  };

  return (
    <>
      <Spin spinning={spinning} tip={text} size={size}>
        <Row style={styles.data}>
          {Boolean(cotizacionInfo) && (
            <>
              <Col span={6}>
                <Text ><strong>{cotizacionInfo.cotizacion}</strong>{cotizacionInfo.folio}</Text>
              </Col>
              <Col span={6}>
                <Text><strong>{cotizacionInfo.empresa}</strong>{cotizacionInfo.nombreEmpresa}</Text>
              </Col>
              <Col span={6}>
                <Text><strong>{cotizacionInfo.cliente}</strong>{cotizacionInfo.clienteNombre}</Text>
              </Col>
            </>
          )}

          {Boolean(btnGroup) && (
            <div style={styles.buttons}>
              <ButtonGroup data={btnGroup} />
            </div>
          )}
        </Row>
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
