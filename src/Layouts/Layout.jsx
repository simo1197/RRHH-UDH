import React from "react";
import Sidebar from "../Components/Sidebar/Sidebar";

function Layout(props){

    const moduleRender = {
        'abcs': Sidebar,
        'abc': 'pageModule_User',
        'xd': 'pageModule_Admin',
        'pxdd': 'pageModule_Servicio'
    }

    return(
        <div>
            <Sidebar />
            {/* {moduleRender[props.role]} */}
        </div>
    )
}

export default Layout;