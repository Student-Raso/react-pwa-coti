const emptyRequest = () => ({
  req: null,
  url: null,
  params: null,
  body: null,
});

const getRequest = (url, params = {}) => ({
  req: "GET",
  url,
  params,
  body: null,
});

const postRequest = (url, body, params = {}) => ({
  req: "POST",
  url,
  params,
  body,
});

const deleteRequest = (url, id, params = {}) => ({
  req: "DELETE",
  url: `${url}/eliminar`,
  body: {
    ...params,
    id: id,
  },
});

export { emptyRequest, getRequest, postRequest, deleteRequest };
