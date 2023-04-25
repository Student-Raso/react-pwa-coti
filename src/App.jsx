import React from "react";
import { ConfigProvider } from "antd";
import { HelmetProvider } from "react-helmet-async";
import { AppProvider, AuthProvider, AlertProvider } from "./hooks";
import { AppRouting } from "./routers";
import esES from "antd/lib/locale/es_ES";

function App() {

  return (
    <ConfigProvider locale={esES}
      theme={{
        token: {
          colorPrimary: '#005aa4',
        },
      }}
    >
      <HelmetProvider>
        <AppProvider>
          <AlertProvider>
            <AuthProvider>
              <AppRouting />
            </AuthProvider>
          </AlertProvider>
        </AppProvider>
      </HelmetProvider>
    </ConfigProvider>
  );
}

export default App;
