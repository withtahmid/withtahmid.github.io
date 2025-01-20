import { useEffect } from "react";
import { baseFrontendURI } from "../configs/urls";

const GoHome = () => {
    useEffect(() => {
      window.location.href = `${baseFrontendURI}/home`;
    }, []);
  
    return null;
};
export default GoHome;