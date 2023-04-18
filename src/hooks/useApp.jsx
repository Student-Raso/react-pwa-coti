import React from "react";
const localStorageKey = "usr_jwt";

const AppContext = React.createContext();

export function AppProvider(props) {
  const [token, setToken] = React.useState(null);

  React.useEffect(() => {
    const jwt = localStorage.getItem(localStorageKey);
    setToken(jwt);
  }, []);

  React.useEffect(() => {
    if (token && token !== "") {
      localStorage.setItem(localStorageKey, token);
    }
  }, [token]);

  const memData = React.useMemo(() => {
    return { token, setToken };
  }, [token, setToken]);

  return <AppContext.Provider value={memData} {...props} />;
}

export function useApp() {
  const context = React.useContext(AppContext);
  if (!context) {
    // eslint-disable-next-line no-throw-literal
    throw "error: app context not defined.";
  }
  return context;
}
