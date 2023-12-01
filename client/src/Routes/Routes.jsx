import { createBrowserRouter } from "react-router-dom";

import ErrorPage from "../components/ErrorPage/ErrorPage";
import Main from "../Layout/Main";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main></Main>,
    
  },
  {
    path: '*',
    element: <ErrorPage></ErrorPage>
  }
]);
