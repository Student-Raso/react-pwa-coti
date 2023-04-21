import React from "react";
import {
  HomeOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  BarChartOutlined,
  CalculatorOutlined,
  SlidersOutlined,
  ShopOutlined,
  GiftOutlined
} from "@ant-design/icons";

import {NoEncontrado, NoAutorizado} from "../views/error";
import {Inicio} from "../views/inicio";
import {Usuarios, UsuarioDetalle} from "../views/admin/usuarios";
import { Perfil } from "../views/perfil";
import { ClienteDetalle, Clientes } from "../views/admin/clientes";
import { CotizacionDetalle, CotizacionListado } from "../views/cotizaciones";
import { EmpresaDetalle, EmpresaListado } from "../views/admin/empresas";
import { ProductoDetalle, ProductoListado } from "../views/admin/productos";

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
    layout: "dashboard",
    path: "/cotizaciones",
    name: "Cotizaciones",
    icon: <CalculatorOutlined  />,
    sidebar: 'single',
    routes: [
      {
        path: "/",
        layout: "dashboard",
        name: "Cotizaciones",
        icon: <SlidersOutlined />,
        sidebar: "single",
        element: CotizacionListado,
      },
      {
        path: "/nuevo",
        layout: "dashboard",
        name: "Nuevo",
        icon: <SlidersOutlined />,
        sidebar: "single",
        element: CotizacionDetalle
      },
      {
        path: "/editar",
        layout: "dashboard",
        name: "Edición",
        icon: <SlidersOutlined />,
        sidebar: "single",
        element: CotizacionDetalle
      }
    ]
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
      {
        layout: "dashboard",
        path: "/clientes",
        name: "Clientes",
        icon: <UserOutlined />,
        sidebar: "single",
        routes: [
          {
            path: "/",
            element: Clientes,
          },
          {
            path: "/agregar",
            element: ClienteDetalle,
          },
          {
            path: "/detalle",
            element: ClienteDetalle,
          },
        ],
      },
      {
        layout: "dashboard",
        path: "/empresas",
        name: "Empresas",
        icon: <ShopOutlined />,
        sidebar: "single",
        routes: [
          {
            path: "/",
            element: EmpresaListado,
          },
          {
            path: "/agregar",
            element: EmpresaDetalle,
          },
          {
            path: "/detalle",
            element: EmpresaDetalle,
          },
        ],
      },
      {
        layout: "dashboard",
        path: "/productos",
        name: "Productos",
        icon: <GiftOutlined />,
        sidebar: "single",
        routes: [
          {
            path: "/",
            element: ProductoListado,
          },
          {
            path: "/agregar",
            element: ProductoDetalle,
          },
          {
            path: "/detalle",
            element: ProductoDetalle,
          },
        ],
      },
    ],
  },
  ...sharedRoutes,
];

const publicRoutes = [...sharedRoutes];

export {dashboardRoutes, publicRoutes};
