import React from "react";
import { emptyRequest, getRequest, postRequest } from "../constants/requests";
import { useHttp } from "./useHttp";
import { useApp } from "./useApp";
import { Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const AuthContext = React.createContext();
const empty = emptyRequest();

export function AuthProvider(props) {
  const { token, setToken } = useApp();
  const [sessionRequest, setSessionRequest] = React.useState(empty);
  const [userRequest, setUserRequest] = React.useState(empty);
  const [session, sessionLoading] = useHttp(sessionRequest);
  const [userResponse, userResponseLoading, userError] = useHttp(userRequest);

  const signIn = React.useCallback(async (email, password) => {
    try {
      if (email !== "" && password !== "") {
        const req = postRequest("v1/iniciar-sesion", {
          correo: email,
          clave: password,
        });
        setSessionRequest({ ...req });
      }
    } catch (e) {
      console.log(e);
    }
  }, []);

  const signOut = React.useCallback(async () => {
    try {
      Modal.confirm({
        title: "Atención",
        icon: <ExclamationCircleOutlined />,
        content: "¿Estás seguro de que deseas cerrar sesión?",
        okText: "Cerrar sesión",
        cancelText: "Cancelar",
        onOk: async () => {
          setToken(null);
          setSessionRequest(empty);
          localStorage.clear();
          setUserRequest(empty);
        },
      });
    } catch (e) {
      console.error(e);
    }
  }, [setToken]);

  const memData = React.useMemo(() => {
    return {
      session: session,
      sessionLoading: sessionLoading,
      user: userResponse?.detalle,
      userLoading: userResponseLoading,
      userError: userError,
      signIn,
      signOut,
    };
  }, [
    userError,
    userResponse,
    userResponseLoading,
    session,
    sessionLoading,
    signIn,
    signOut,
  ]);

  React.useEffect(() => {
    if (session && !sessionLoading) {
      if (session?.detalle) {
        setToken(session?.detalle?.token);
      }
    }
  }, [session, sessionLoading, setToken]);

  React.useEffect(() => {
    if (token) {
      const agendaReq = getRequest("v1/perfil");
      setUserRequest(() => agendaReq);
    } else {
      setUserRequest(empty);
    }
  }, [token]);

  return <AuthContext.Provider value={memData} {...props} />;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    // eslint-disable-next-line no-throw-literal
    throw "error: auth context not defined.";
  }
  return context;
}