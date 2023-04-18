import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthLayout } from "../components/layouts";
import { Ingresar } from "../views/auth";
import { NoEncontrado } from "../views/error";

const PublicRouter = () => {
  return (
    <AuthLayout>
      <Routes>
        <Route path="/" element={<Ingresar />} />
        <Route path="*" element={<NoEncontrado />} />
      </Routes>
    </AuthLayout>
  );
};

export default PublicRouter;
