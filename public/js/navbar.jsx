import React from "react";
import { useNavigate } from "react-router-dom";
import "css/navbar.css";

const VerticalNavBar=({items})=>{
   const navigate =useNavigate();
    return(
        <nav className="vertical-nav">
            {items.map((item)=>(
                <button 
                key={item.path}
                className="nav-button"
                onClick={()=>navigate(item.path)}>
                    {item.label}
                </button>
            ))}
        </nav>
    )
};
export default VerticalNavBar;
