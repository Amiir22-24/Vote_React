import { createBrowserRouter, RouterProvider } from "react-router"
import Votepage from "../Pages/Votepage"
import CandidatPage from "../Pages/CandidatPage"
import Login from "../Pages/Admin/Login"
import Candidats from "../Pages/Admin/Candidats"
import Dashboard from "../Pages/Admin/Dashboard"
import Votant from "../Pages/Admin/Votant"

const router = createBrowserRouter([
    
    {
        path: "/",
        children: [
            {
                index: true,
                element: <CandidatPage />
            },
            {
                path: "vote",
                element: <Votepage />
            },
        ]
    },
    {
        path: "/admin",
        children: [
            {
                path: "login",
                element: <Login />
            },
            {
                path: "tableau-de-bord",
                element: <Dashboard />
            },
            {
                path: "candidats",
                element: <Candidats />
            },
            {
                path: "votants",
                element: <Votant />
            },
        ]
    }

])

const Router = () => {
    return (
        <RouterProvider router={router} />
    )
}

export default Router