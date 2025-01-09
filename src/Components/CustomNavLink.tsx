import React from "react";
import { NavLink } from "react-router-dom";

interface CustomNavLinkProps {
    to: string;
    text: string;
}

const CustomNavLink = ( { to, text }: CustomNavLinkProps ):React.ReactNode => {
    return <NavLink to={to} className="my-1 text-sm text-center font-roboto hover:underline"> {text}</NavLink>
}
export default CustomNavLink;