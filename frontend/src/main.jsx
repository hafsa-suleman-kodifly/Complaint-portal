import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import { ConfigProvider, App as AntApp } from "antd";
import App from "./App";
import { theme } from "./theme";   // new file (blue token config)
import "./index.css";              // new file (base resets)

ReactDOM.createRoot(document.getElementById("root")).render(
  <ConfigProvider theme={theme}>
    <AntApp>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <App />
      </BrowserRouter>
    </AntApp>
  </ConfigProvider>
);