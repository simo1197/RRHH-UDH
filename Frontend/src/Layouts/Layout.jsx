import React from "react";
import Sidebar from "../Components/Sidebar/Sidebar";
import Navbar from "../Components/Navbar/Navbar";
import AdminPage from "../pages/AdminPage/AdminPage";
import UserPage from "../pages/UserPage/UserPage";


const Layout = ({children}) => {

    const moduleRender = {
        'abcs': Sidebar,
        'admin': ()=>{return <AdminPage />},
        'user': ()=>{return <UserPage />},
        'pxdd': 'pageModule_Servicio'
    }

    return(
        <div>
            <Sidebar />
            <Navbar />
            {/* {moduleRender[props.role]}*/ }
            {children} 
        </div>
    )
}

export default Layout;