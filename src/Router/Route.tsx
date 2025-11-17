import { createBrowserRouter, RouterProvider } from "react-router"
import Login from "../Pages/Admin/auth/Login"
import Candidats from "../Pages/Admin/Candidats/Candidats"
import Votant from "../Pages/Admin/Votant"
import SideBar from "../Pages/Admin/SideBar"
import { CandidatUpdate } from "../Pages/Admin/Candidats/CandidatUpdate"
import UserPage from "../Pages/Users/UserPage"

const router = createBrowserRouter([
    
    {
        path: "/",
        children: [
            {
                index: true,
                element: <UserPage />
            }
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