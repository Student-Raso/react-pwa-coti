import React from 'react'
import PropTypes from 'prop-types';

const Divider = ({ pt, pr, pb, pl, py, px, mt, mr, mb, ml, my, mx }) => {

  const paddingTop = pt || 0;
  const paddingRight = pr || 0;
  const paddingBottom = pb || 0;
  const paddingLeft = pl || 0;
  const marginTop = mt || 0;
  const marginRight = mr || 0;
  const marginBottom = mb || 0;
  const marginLeft = ml || 0;

  const styles = {
    div: {
      background: '#fff',
      width: '100%',
      height: 1,
      paddingTop: py > 0 ? py : paddingTop,
      paddingRight: px > 0 ? px : paddingRight,
      paddingBottom: py > 0 ? py : paddingBottom,
      paddingLeft: px > 0 ? px : paddingLeft,
      marginTop: my > 0 ? my : marginTop,
      marginRight: mx > 0 ? mx : marginRight,
      marginBottom: my > 0 ? my : marginBottom,
      marginLeft: mx > 0 ? mx : marginLeft,
    }
  } 

  return (
    <div style={styles.div}></div>
  )
}
Divider.propTypes = {
  mt: PropTypes.number,
  mr: PropTypes.number,
  mb: PropTypes.number,
  ml: PropTypes.number,
  my: PropTypes.number,
  mx: PropTypes.number,
  pt: PropTypes.number,
  pr: PropTypes.number,
  pb: PropTypes.number,
  pl: PropTypes.number,
  py: PropTypes.number,
  px: PropTypes.number,
}

export default Divider