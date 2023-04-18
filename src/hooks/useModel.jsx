import React from "react";
import { useNavigate } from "react-router-dom";
import { emptyRequest, getRequest, postRequest } from "../constants/requests";
import { useHttp } from "./useHttp";

const empty = emptyRequest();

export function useModel({
  name,
  id,
  fields = null,
  expand = null,
  extraParams = null,
  redirectOnPost = false,
  path = "guardar",
}) {
  const [modelRequest, setProfileRequest] = React.useState(empty);
  const [model, modelLoading, modelError, refreshModel] = useHttp(modelRequest);
  const [updateRequest, setUpdateRequest] = React.useState(empty);
  const [postResult, postResultLoading, postResultError] =
    useHttp(updateRequest);
  const navigate = useNavigate();

  const updateModel = React.useCallback(
    (newModel, alert = true) => {
      debugger;
      if (!postResultLoading) {
        if (newModel.id) {
          newModel = { id: newModel.id };
          delete newModel.id;
        }
        const updateReq = postRequest(`${name}/${path}`, newModel);
        updateReq.alert = alert;
        setUpdateRequest(updateReq);
      }
    },
    [name, postResultLoading, path]
  );

  React.useEffect(() => {
    let mounted = true;
    if (mounted && postResult && redirectOnPost && !postResultError) {
      const { pathname } = navigate.location; // todo revisar esto
      const redirectTo = pathname.split("/").filter((e) => e !== "");
      navigate.push("/" + redirectTo[0]);
    }
    return () => {
      mounted = false;
    };
  }, [postResult, redirectOnPost, postResultError, navigate]);

  React.useEffect(() => {
    if (!name || !id) return;
    let params = { id: id };
    if (fields) params = { ...params, fields };
    if (expand) params = { ...params, expand };
    if (extraParams) params = { ...params, ...extraParams };
    const modelReq = getRequest(name, params);
    setProfileRequest(modelReq);
  }, [name, id, fields, expand, extraParams]);

  return React.useMemo(() => {
    let modelTmp = null;
    if (model && model.resultado && model.resultado.length > 0) {
      modelTmp = model.resultado[0];
      if (model.detalle) modelTmp.detalleExtra = model.detalle;
    }
    let finalError = {};
    if (modelError) finalError = { ...modelError };
    if (postResultError) finalError = { ...postResultError };
    return {
      model: modelTmp,
      modelLoading,
      modelError: finalError,
      refreshModel,
      updateModel,
      updateModelResult: postResult,
      updateModelLoading: postResultLoading,
    };
  }, [
    model,
    modelLoading,
    modelError,
    refreshModel,
    postResult,
    postResultLoading,
    postResultError,
    updateModel,
  ]);
}