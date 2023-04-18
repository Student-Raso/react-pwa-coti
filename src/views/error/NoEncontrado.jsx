import React from "react";
import { useNavigate } from "react-router-dom";

const NoEncontrado = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    // navigate("/")
  }, [])

  return "NO ENCONTRADO";
};

export default NoEncontrado;