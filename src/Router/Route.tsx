import { createBrowserRouter, RouterProvider } from "react-router"
import Votepage from "../Pages/Votepage"
import CandidatPage from "../Pages/CandidatPage"
import Login from "../Pages/Admin/Login"
import Candidats from "../Pages/Admin/Candidats"
import Dashboard from "../Pages/Admin/Dashboard"
import Votant from "../Pages/Admin/Votant"
import SideBar from "../Pages/Admin/SideBar"
import CandidatList from "../Pages/CandidatList"
import { CandidatUpdate } from "../Pages/Admin/CandidatUpdate"

const router = createBrowserRouter([
    
    {
        path: "/",
        children: [
            {
                index: true,
                element: <CandidatList />
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
                element: <SideBar />
            },
            {
                path: "candidats",
                element: <Candidats />
            },
            {
                path: "candidats/:id/edit",
                element: <CandidatUpdate />
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