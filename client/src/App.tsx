import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import routes from "./routes/routes";

const routesProvider = createBrowserRouter(routes);
const App = () => {
  return <RouterProvider router={routesProvider} />;
};

export default App;
