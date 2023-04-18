import React from "react";

const AlertContext = React.createContext();

export function AlertProvider(props) {
  const [open, setOpen] = React.useState(false);
  const [position, setPosition] = React.useState({
    vertical: "bottom",
    horizontal: "right",
  });
  const [severity, setSeverity] = React.useState("info");
  const [message, setMessage] = React.useState("");

  React.useEffect(() => {
    let mounted = true;
    if (mounted) {
      setTimeout(() => {
        setOpen(false);
      }, 5000);
    }
    return () => {
      mounted = false;
    };
  }, [open]);

  const showAlert = React.useCallback(
    ({ message, severity = "info", position = null }) => {
      setOpen(true);
      setMessage(message);
      setSeverity(severity);
      if (position) setPosition(position);
    },
    []
  );

  const memData = React.useMemo(() => {
    // const closeAlert = () => {
    //   setOpen(false);
    //   setTimeout(() => {
    //     setPosition(defaultPlace);
    //     setSeverity(defaultColor);
    //     setIcon(defaultIcon);
    //     setMessage(defaultMessage);
    //   }, 2000);
    // };
    return {
      open,
      position,
      severity,
      message,
      showAlert,
      // closeAlert,
    };
  }, [open, position, severity, message, showAlert]);

  return <AlertContext.Provider value={memData} {...props} />;
}

export function useAlert() {
  const context = React.useContext(AlertContext);
  if (!context) {
    // eslint-disable-next-line no-throw-literal
    throw "error: alert context not defined.";
  }
  return context;
}