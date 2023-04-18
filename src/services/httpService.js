const localStorageKey = "usr_jwt";
const baseUrl = import.meta.env.VITE_API_URL;

const getCurrentToken = () => {
  return new Promise((resolve, reject) => {
    const jwt = localStorage.getItem(localStorageKey);
    if (!jwt) reject("No hay sesión.");
    resolve(jwt);
  });
};

const getHeaders = (token) => ({
  "Content-Type": "application/json",
  Accept: "application/json",
  Authorization: `Bearer ${token}`,
});

const getHeadersWithoutToken = () => ({
  "Content-Type": "application/json",
  Accept: "application/json",
});

const HttpService = {

  get: async (url, auth = true) => {
    let token = null;
    if (auth) token = await getCurrentToken();
    const response = await fetch(baseUrl + url, {
      method: "GET",
      headers: auth ? getHeaders(token) : getHeadersWithoutToken(),
    });

    let serverResponse = await response.json();

    return {
      isError: response?.status !== 200  ? true : false,
      status: response?.status,
      resultado: (serverResponse?.resultado || serverResponse) || null ,
      paginacion: serverResponse?.paginacion || null,
      mensaje: serverResponse?.mensaje || null,
    }
  },

  post: async (url, data, auth = true, type = 1) => {
    let token = null;
    if (auth) token = await getCurrentToken();
    const response = await fetch(baseUrl + url, {
      method: "POST",
      headers: auth ? getHeaders(token) : getHeadersWithoutToken(),
      body: JSON.stringify(data),
    });

    let serverResponse = null
    try {
      if(type === 1) {
        serverResponse = await response.json();
      }
      if(type === 2){
        serverResponse = await response.blob();
      }
    } catch (error) {
      console.log(error)
    }
    
    return {
      isError: response?.status !== 200  ? true : false,
      status: response?.status,
      errores: serverResponse?.errores || null,
      detalle: serverResponse?.detalle || null,
      mensaje: serverResponse?.mensaje || null,
      response: serverResponse || null,
    }
  },

  postFormData: async (url, data, auth = true, type = 1) => {
    let token = null;
    if (auth) token = await getCurrentToken();
    const response = await fetch(baseUrl + url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: data
    });

    let serverResponse = null
    try {
      if(type === 1) {
        serverResponse = await response.json();
      }
      if(type === 2){
        serverResponse = await response.blob();
      }
    } catch (error) {
      console.log(error)
    }
    
    return {
      isError: response?.status !== 200  ? true : false,
      status: response?.status,
      errores: serverResponse?.errores || null,
      detalle: serverResponse?.detalle || null,
      mensaje: serverResponse?.mensaje || null,
      response: response || null,
      resultado: (serverResponse?.resultado || serverResponse) || null,
    }
  },

  delete: async (url, data, auth = true) => {
    let token = null;
    if (auth) token = await getCurrentToken();
    const response = await fetch(baseUrl + url, {
      method: "DELETE",
      headers: auth ? getHeaders(token) : getHeadersWithoutToken(),
      body: JSON.stringify(data),
    });

    let serverResponse = await response.json();
    
    return {
      isError: response?.status !== 200  ? true : false,
      status: response?.status,
      errores: serverResponse?.errores || null,
      detalle: serverResponse?.detalle || null,
      mensaje: serverResponse?.mensaje || null
    }
  },
};

export default HttpService;