import { NON_DIGIT } from "../constants";
import { Modal, notification } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import httpService from "../services/httpService";
import React from "react";
import * as ExcelJS from 'exceljs'; // lib: exceljs
import { saveAs } from 'file-saver';  //lib: file-saver
import imageToBase64 from 'image-to-base64/browser';  //lib: image-to-base64
import { Link } from "react-router-dom";
import { Tooltip } from 'antd';

const baseUrl = import.meta.env.VITE_API_URL;

export const abrirArchivo = (url) => {
  if (url) {
    const a = document.createElement("a");
    a.target = "_blank";
    a.href = url;
    a.click();
  }
  return null;
}

const openInNewTab = (ruta) => {
  window.open(`${baseUrl}${ruta}`, '_blank', 'noopener,noreferrer');
}

const capitalizeFirst = (string) => {
  const split = string.split("-")
  let palabraUnida = ""
  split.forEach((s) => {
    palabraUnida = palabraUnida + s.charAt(0).toUpperCase() + s.slice(1)
  })
  return palabraUnida;
};

const propertyAccesor = (rootObj, accesor = "") => {
  if (!rootObj) return "";
  const properties = accesor.split(".");
  let tmp = rootObj;
  properties.forEach((prop) => (tmp = tmp[prop]));
  return tmp.toString();
};

const serialDateToJSDate = serial => {
  const step = new Date().getTimezoneOffset() <= 0 ? 25567 + 2 : 25567 + 1;
  const utc_days  = Math.floor(serial - step);
  const utc_value = utc_days * 86400;
  const date_info = new Date(utc_value * 1000);
  const fractional_day = serial - Math.floor(serial) + 0.0000001;
  let total_seconds = Math.floor(86400 * fractional_day);
  const seconds = total_seconds % 60;
  total_seconds -= seconds;
  const hours = Math.floor(total_seconds / (60 * 60));
  const minutes = Math.floor(total_seconds / 60) % 60;
  return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
};

const validateName = (name) => {
  let re = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/
  return re.test(name);
};

const validateNumber = (number) => {
  const intValue = number.toString().replace(NON_DIGIT, "")
  return !isNaN(intValue);
};

const agregarFaltantes = (data, newData, campo) => {
  let ids = data.map(item => item[campo]);
  let aux = [...data];
  for(let i in newData) {
    let modelo = newData[i];
    if (!modelo){
      continue
    }
    const indice = ids.indexOf(modelo[campo]);
    if(modelo && indice === -1) {
      aux.push(modelo);
    } else {
      aux[indice] = modelo;
    }
  }
  return aux;
};

const eliminarRegistro = (nombre, id, url, alTerminar) => {
  if(!id) return;
  Modal.confirm({
    title: "Eliminar",
    content: `¿Está seguro de eliminar "${nombre}"?`,
    icon: <DeleteOutlined style={{ color: '#ff0000' }}/>,
    okText: 'Eliminar',
    okButtonProps: {
      type: 'danger',
      style: { color: '#FFFFFF', background: '#FF0000' }
    },
    cancelText: 'Cancelar',
    onOk: async () => {
      try {
        const res = await httpService.delete(url, { id: id});
        if (res && res.status === 200) {
          notification.success({
            message: 'Éxito',
            description: res?.mensaje
          });
          alTerminar && alTerminar();
        }
      else if ( res?.status === 400 ) {
        notification.error({
          message: "Atención",
          description: res?.mensaje,
        });
      }
      } catch (error) {
        console.log(error);
        notification.error({
          message: 'Error',
          description: error,
        });
        return 'error';
      }
    },
  });
};

const respuestas = (res) => {

  if (!res) return "Error en respuesta";

  if ((res?.status >= 400 && res?.status < 499) && res?.errores !== null) {
    const errores = Object.values(res?.errores)
    notification.error({
      message: 'Atención',
      description: errores.map((e, i) => <React.Fragment key={`${i}-error`}><span>- {e}</span><br/></React.Fragment>),
      placement: 'bottomRight'
    });
  } else if ((res?.status >= 400 && res?.status < 499) && res?.errores === null) {
    notification.error({
      message: 'Atención',
      description: 'Hubo un problema del lado del servidor.',
      placement: 'bottomRight'
    });
  } else if (res?.status >= 200 && res?.status < 399) {
    notification.success({
      message: '¡Éxito!',
      description: `${res?.mensaje}`,
      placement: 'bottomRight'
    });
  }
};

const generateDefaultChartOptions = (chartType = "pie", options = {}, callback) => ({
  chart: {
    type: chartType,
    inverted: options.inverted || false,
    options3d: {
      enabled: chartType === "pie",
      alpha: 45,
      beta: 0,
    },
    height: options.chartHeight || null,
  },
  colors: options?.colores || ["#2f7ed8", "#0d233a", "#8bbc21", "#910000", "#1aadce", "#492970", "#f28f43", "#77a1e5", "#c42525", "#a6c96a"],
  credits: {
    enabled: false,
  },
  title: {
    text: options?.titulo || "TITULO POR DEFAULT",
  },
  plotOptions: {
    [chartType]: {
      innerSize: 100,
      depth: 45,
      events: {
        click: typeof callback === "function" ? callback : () => {},
      },
      series: {
        stacking: 'normal'
      }
    },
  },
  series: [
    {
      name: options?.nombre || "NOMBRE DE LA COLECCION DE DATOS",
      data: options?.datos || [],
    },
  ],
  subtitle: {
    text: options?.subtitulo || "SUBTITULO POR DEFAULT",
  },
  ...options?.options
});

const lastPathName = () => {
  const url = window.location.pathname;
  return {
    lastPath: url.split("/").pop(), // cambiar por pathname
    beforePath: url.split("/")[url.split("/").length -2]
  };
};

const quitarSignos = (values) => {
  let _values = values
  if (typeof values === "string")
     _values = values.replaceAll("$", "").replaceAll(",", "");

  return parseFloat(_values);
}

function makeKey(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

function eliminarObjeto(arr, key) {
  const obj = arr.findIndex((obj) => obj.key === key);
  if(obj > -1) {
    arr.splice(obj, 1);
  }
  return arr;
}

const isEllipsis = (columns, key) => {
  const obtenerColumna = columns.find(column => column.key === key);
  return Boolean(obtenerColumna && obtenerColumna?.ellipsis)
}

const getRandomUid = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

const renderTotal = (array, prop) => {
  if(prop?.length > 0 && array?.length > 0) {
    const total = array.reduce((acc, curr) => acc + Number(curr[prop]), 0)
    return  Number(total) > 0
      ? Number(total).toFixed(2)
      : (0).toFixed(2)
  }
  return (0).toFixed(2)
}

const FormatoPesos = (number = 0) => {
  const exp = /(\d)(?=(\d{3})+(?!\d))/g;
  const rep = '$1,';
  return number?.toString().replace(exp, rep);
}


const ValidarRfc = (item) => {
  let re = /^[A-Z&Ñ]{3,4}[0-9]{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])[A-Z0-9]{2}[0-9A]$/
  let validado = item.match(re);

  if (!validado)
    return false;
  else
    return true
}

const ValidarTelefono = (item) => {
  let re = /^[0-9]{10}$/
  let validado = item.match(re);

  if (!validado)
    return false;
  else
    return true
}

const ValidarCorreo = (item) => {
  let re = /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/
  let validado = item.match(re);

  if (!validado)
    return false;
  else
    return true
}

const obtenerExtensionImagen = (path) => {
  const ext = path.split('.').pop();
  return ext.toLowerCase();
}

const reporteBase = async (
  cols,
  data,
  nombre = "archivo-excel",
  titulo = "",
  subtitulo = "",
  path = null
) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(titulo);  // Título de la hoja de cálculo 

    if (path !== null && typeof path === 'string') {
      const img64 = await imageToBase64(path);
      const idImagen = workbook.addImage({
        base64: img64,
        extension: obtenerExtensionImagen(path),  // * jpg, gif, png
      });
      worksheet.addImage(idImagen, {  // * Aquí se acomoda la imagen
        tl: { col: 0.2, row: 0.2 }, // * midpoints
        ext: { width: 353, height: 70 },
        editAs: 'oneCell'
      });
    }

    const header = cols?.map(c => (c.title));

    worksheet.columns = cols

    const styleTitle = { // * estilo para el título
      font: {
        bold: true,
        size: 18,
      },
      alignment: {
        horizontal: 'center',
        vertical: 'center',
        wrapText: true
      },
    };
    const styleSub = { // * estilo para el título
      font: {
        bold: true,
        size: 12,
      },
      alignment: {
        horizontal: 'center',
        vertical: 'center',
        wrapText: true
      },
    };
    const rowHeaderStyle = { // * estilo para el título
      font: {
        bold: true,
        size: 12,
        color: { argb: 'FFFFFFFF' }
      },
      alignment: {
        horizontal: 'center',
        vertical: 'center',
        wrapText: true
      },
      fill: {
        type: "pattern",
        pattern: "solid",
        bgColor: { argb: 'FFFFFFFF' },
        fgColor: { argb: 'FF340909' }
      }
    };
    worksheet.mergeCells('A1:A3');  // * combinar celdas  (lugar imagen)

    const colA = worksheet.getColumn("A");
    colA.width = 60;
    const colB = worksheet.getColumn("B");
    colB.width = 15;
    const colC = worksheet.getColumn("C");
    colC.width = 15;

    // * Despues de mergeCells se debe aplicar estilos y valores  
    worksheet.getCell('B1').value = titulo; // * valor de la celda que se combinará
    worksheet.getCell('B1').style = styleTitle; // * estilo de la celda que se combinará
    worksheet.getCell('B1').alignment = { vertical: 'middle', horizontal: 'left' }; // * alineación de la celda que se combinará

    // * Despues de mergeCells se debe aplicar estilos y valores  
    worksheet.getCell('B2').value = subtitulo; // * valor de la celda que se combinará
    worksheet.getCell('B2').style = styleSub; // * estilo de la celda que se combinará
    worksheet.getCell('B2').alignment = { vertical: 'middle', horizontal: 'left' }; // * alineación de la celda que se combinará
    worksheet.addRow([]);
    worksheet.addRow(header);

    let letras = "A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,AA,AB,AC,AD,AE,AF,AG,AH,AI"
    const _letras = letras.split(',');
    for (let i = 0; i < header.length; i++) {
      worksheet.getCell(`${_letras[i]}5`).style = rowHeaderStyle
    }

    for (let i = 0; i < data?.length; i++) { // * agregar datos (contenido)
      const row = data[i];
      worksheet.addRow(row);
    }

    // * Este forEach es para agregar width a las columnas dependiendo de su contenido
    worksheet.columns.forEach((column) => {
      var dataMax = 0;

      column.eachCell({ includeEmpty: true }, (cell) => {
        var columnLength = cell.value?.length;

        if (columnLength > dataMax) {
          dataMax = columnLength;
        }
      })
      column.width = dataMax < 30 ? 30 : dataMax;
    });

    const firstCol = 50;
    worksheet.getColumn('A').width = firstCol

    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `${nombre}.xlsx`);
    });
  } catch (error) {
    console.log(error);
  }
}

const reporteExcelES = async (
  cols,
  data,
  nombre = "archivo-excel",
  titulo = "",
  subtitulo = "",
  path = null,
  comb = null
) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(titulo);  // Título de la hoja de cálculo 

    if (path !== null && typeof path === 'string') {
      const img64 = await imageToBase64(path);
      const idImagen = workbook.addImage({
        base64: img64,
        extension: obtenerExtensionImagen(path),  // * jpg, gif, png
      });
      worksheet.addImage(idImagen, {  // * Aquí se acomoda la imagen
        tl: { col: 0.2, row: 0.2 }, // * midpoints
        ext: { width: 353, height: 70 },
        editAs: 'oneCell'
      });
    }

    const header = cols?.map(c => (c.title));

    worksheet.columns = cols

    const styleTitle = { // * estilo para el título
      font: {
        bold: true,
        size: 18,
      },
      alignment: {
        horizontal: 'center',
        vertical: 'center',
        wrapText: true
      },
    };

    const estiloEntrada = { // * estilo para ENTRADA
      font: {
        bold: true,
        size: 12,
        color: { argb: 'FFFFFFFF' }
      },
      alignment: {
        horizontal: 'center',
        vertical: 'center',
        wrapText: true
      },
      fill: {
        type: "pattern",
        pattern: "solid",
        bgColor: { argb: 'FFFFFFFF' },
        fgColor: { argb: 'ff00ff00' }
      }
    };

    const estiloSalida = { // * estilo para ENTRADA
      font: {
        bold: true,
        size: 12,
        color: { argb: 'FFFFFFFF' }
      },
      alignment: {
        horizontal: 'center',
        vertical: 'center',
        wrapText: true
      },
      fill: {
        type: "pattern",
        pattern: "solid",
        bgColor: { argb: 'FFFFFFFF' },
        fgColor: { argb: 'ffff0000' }
      }
    };

    const styleSub = { // * estilo para el título
      font: {
        bold: true,
        size: 12,
      },
      alignment: {
        horizontal: 'center',
        vertical: 'center',
        wrapText: true
      },
    };
    const rowHeaderStyle = { // * estilo para el título
      font: {
        bold: true,
        size: 12,
        color: { argb: 'FFFFFFFF' }
      },
      alignment: {
        horizontal: 'center',
        vertical: 'center',
        wrapText: true
      },
      fill: {
        type: "pattern",
        pattern: "solid",
        bgColor: { argb: 'FFFFFFFF' },
        fgColor: { argb: 'FF340909' }
      }
    };
    worksheet.mergeCells('A1:A3');  // * combinar celdas  (lugar imagen)

    const colA = worksheet.getColumn("A");
    colA.width = 60;
    const colB = worksheet.getColumn("B");
    colB.width = 15;
    const colC = worksheet.getColumn("C");
    colC.width = 15;

    // * Despues de mergeCells se debe aplicar estilos y valores  
    worksheet.getCell('B1').value = titulo; // * valor de la celda que se combinará
    worksheet.getCell('B1').style = styleTitle; // * estilo de la celda que se combinará
    worksheet.getCell('B1').alignment = { vertical: 'middle', horizontal: 'left' }; // * alineación de la celda que se combinará

    // * Despues de mergeCells se debe aplicar estilos y valores  
    worksheet.getCell('B2').value = subtitulo; // * valor de la celda que se combinará
    worksheet.getCell('B2').style = styleSub; // * estilo de la celda que se combinará
    worksheet.getCell('B2').alignment = { vertical: 'middle', horizontal: 'left' }; // * alineación de la celda que se combinará
    worksheet.addRow([]);

    worksheet.mergeCells('A5:Q5');
    worksheet.mergeCells('R5:AB5');
    worksheet.getCell('A5').value =  "ENTRADA"
    worksheet.getCell('A5').style = estiloEntrada
    worksheet.getCell('R5').value =  "SALIDA"
    worksheet.getCell('R5').style = estiloSalida

    worksheet.addRow(header); // * agregando fila de encavezados

    let letras = "A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,AA,AB,AC,AD,AE,AF,AG,AH,AI"
    const _letras = letras.split(',');


    // * agregando estilo a encabezados
    for (let i = 0; i < header.length; i++) {
      worksheet.getCell(`${_letras[i]}6`).style = rowHeaderStyle
    }

    // * agregando datos
    for (let i = 0; i < data?.length; i++) { // * agregar datos (contenido)
      const row = data[i];
      worksheet.addRow(row);
    }

    // * Este forEach es para agregar width a las columnas dependiendo de su contenido
    worksheet.columns.forEach((column) => {
      var dataMax = 0;

      column.eachCell({ includeEmpty: true }, (cell) => {
        var columnLength = cell.value?.length;

        if (columnLength > dataMax) {
          dataMax = columnLength;
        }
      })
      column.width = dataMax < 30 ? 30 : dataMax;
    });

    // * agregando ancho a primera columna
    const firstCol = 50;
    worksheet.getColumn('A').width = firstCol

    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `${nombre}.xlsx`);
    });
  } catch (error) {
    console.log(error);
  }
}

const ValidarContrasena = (texto) => {
  let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,21}$/;
  return texto.match(regex);
}

const Roles = [
  {value: "admin", label:"Administrador"},
  {value: "desarrollador", label:"Desarrollador"},
  {value: "usuario", label:"Usuario"},
];

const { lastPath } = lastPathName();

const linkText = (value, row, key, columns) => (
  <Link to={`/administracion/${lastPath}/detalle?id=${row.id}`}>
    {
      
      isEllipsis(columns, key)
        ? <Tooltip title={value}>
          {value}
        </Tooltip>
      : value
    }
  </Link>
);


export {
  agregarFaltantes,
  capitalizeFirst,
  propertyAccesor,
  serialDateToJSDate,
  validateName,
  validateNumber,
  eliminarRegistro,
  generateDefaultChartOptions,
  respuestas,
  lastPathName,
  makeKey,
  eliminarObjeto,
  openInNewTab,
  quitarSignos,
  isEllipsis,
  getRandomUid,
  renderTotal,
  FormatoPesos,
  ValidarRfc,
  ValidarTelefono,
  ValidarCorreo,
  reporteBase,
  reporteExcelES,
  ValidarContrasena,
  Roles,
  linkText
};