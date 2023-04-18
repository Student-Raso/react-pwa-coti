import React from "react";
import {
  HomeOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  BarChartOutlined,
  ImportOutlined,
} from "@ant-design/icons";

import {NoEncontrado, NoAutorizado} from "../views/error";
import {Inicio} from "../views/inicio";
import {Usuarios, UsuarioDetalle} from "../views/admin/usuarios";
import {Entradas, EntradaDetalle} from "../views/entradas";
import { tipoUsuarios } from "../constants";
import { Perfil } from "../views/perfil";


const signOutRoute = () => {
  return "Cargando...";
};

const sharedRoutes = [
  {
    path: "/no-autorizado",
    element: NoAutorizado,
  },
  {
    path: "/salir",
    icon: LogoutOutlined,
    element: signOutRoute,
  },
  {
    path: "*",
    element: NoEncontrado,
  },
];

const dashboardRoutes = [
  {
    layout: "dashboard",
    path: "/",
    name: "Inicio",
    icon: <HomeOutlined/>,
    sidebar: "single",
    element: Usuarios,
  },
  {
    layout:"dashboard",
    path:"/perfil",
    name:"Perfil",
    icon:<UserOutlined />,
    sidebar:"none",
    element: Perfil
  },
  {
    layout: "dashboard",
    path: "/administracion",
    name: "Administración",
    icon: <SettingOutlined/>,
    sidebar: "collapse",
    routes: [
      {
        layout: "dashboard",
        path: "/",
        name: "Administración",
        icon: <BarChartOutlined/>,
        element: Inicio,
      },
      {
        layout: "dashboard",
        path: "/usuarios",
        name: "Usuarios",
        icon: <UserOutlined />,
        sidebar: "single",
        routes: [
          {
            path: "/",
            element: Usuarios,
          },
          {
            path: "/agregar",
            element: UsuarioDetalle,
          },
          {
            path: "/detalle",
            element: UsuarioDetalle,
          },
        ],
      },
    ],
  },
  ...sharedRoutes,
];

const publicRoutes = [...sharedRoutes];

export {dashboardRoutes, publicRoutes};
