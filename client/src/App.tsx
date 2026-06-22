import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import routes from "./routes/routes";
import { Suspense } from "react";
import { ThemeProvider } from "./utils/ThemeProvider";

const routesProvider = createBrowserRouter(routes);
const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Suspense
        fallback={
          <div className="w-svw h-svh flex justify-center content-center">
            <span className="loading loading-infinity loading-xl"></span>
          </div>
        }
      >
        <RouterProvider router={routesProvider} />
      </Suspense>
    </ThemeProvider>
  );
};

export default App;
