import React, { useState } from "react";
import Sidebar from "../Components/Sidebar/Sidebar";
import Navbar from "../Components/Navbar/Navbar";

const Layout = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false); // Estado compartido con Sidebar

    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>
            {/* Sidebar recibe el estado collapsed y el setCollapsed */}
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

            {/* Contenedor principal que ajusta el margen según el estado del sidebar */}
            <div
                style={{
                    flex: 1,
                    transition: "margin-left 0.3s ease",
                    marginLeft: collapsed ? "70px" : "250px", // coincidir con tus variables CSS
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Navbar />
                {children}
            </div>
        </div>
    );
};

export default Layout;
