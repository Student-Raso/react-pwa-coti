import React from "react";
import { emptyRequest, getRequest, deleteRequest } from "../constants/requests";
import { useHttp } from "./useHttp";

const empty = emptyRequest();

export function useModels({
  name,
  fields = null,
  expand = null,
  ordenar = null,
  limite = null,
  pagina = null,
  extraParams = null,
}) {
  const [modelRequest, setModelsRequest] = React.useState(empty);
  const [modelsPage, setModelsPage] = React.useState(null);
  const [models, modelsLoading, modelsError, refreshModels] = useHttp(modelRequest);

  const [delRequest, setDelRequest] = React.useState(empty);
  const [deleteResult, deleteResultLoading] = useHttp(delRequest);

  const deleteModel = React.useCallback(
    async (id) => {
      if (!deleteResultLoading) {
        const deleteReq = deleteRequest(name, id);
        deleteReq.alert = true;
        setDelRequest(deleteReq);
      }
    },
    [name, deleteResultLoading]
  );

  React.useEffect(() => {
    if (!name) {
      setModelsRequest(empty);
      return;
    }
    let params = {};
    if (fields) params = { ...params, fields };
    if (expand) params = { ...params, expand };
    if (ordenar) params = { ...params, ordenar };
    if (limite) params = { ...params, limite };
    if (pagina) params = { ...params, pagina };
    if (extraParams) params = { ...params, ...extraParams };
    const modelReq = getRequest(name, params);
    setModelsRequest(modelReq);
  }, [name, fields, expand, ordenar, limite, pagina, extraParams]);

  React.useEffect(() => {
    if (!modelsLoading && !modelsError && models) {
      const { paginacion } = models;
      setModelsPage(paginacion);
    }
  }, [models, modelsLoading, modelsError]);

  React.useEffect(() => {
    if (!deleteResultLoading && deleteResult) {
      refreshModels();
    }
  }, [deleteResult, deleteResultLoading, refreshModels]);

  return React.useMemo(() => {
    let resultado = [];
    if (models && models.resultado && models.resultado.length > 0) {
      resultado = [...models.resultado];
    }
    let modelsLoadingFinal = modelsLoading || deleteResultLoading;
    return {
      models: resultado,
      modelsLoading: modelsLoadingFinal,
      modelsError,
      modelsPage,
      refresh: refreshModels,
      deleteModel,
    };
  }, [
    models,
    modelsLoading,
    modelsError,
    modelsPage,
    refreshModels,
    deleteResultLoading,
    deleteModel,
  ]);
}