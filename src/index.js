import React from "react";
import ReactDOM from "react-dom";
import Root from "./Root";
import registerServiceWorker from "./registerServiceWorker";
import "leaflet/dist/leaflet.css";

ReactDOM.render(<Root />, document.getElementById("root"));
registerServiceWorker();
