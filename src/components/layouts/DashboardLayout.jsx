import React from "react";
import { Layout, Menu, Breadcrumb, Avatar, Button, Row, Col, Dropdown, Tooltip } from "antd";
import { HomeOutlined, LoginOutlined, MenuFoldOutlined, MenuUnfoldOutlined, SettingOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../hooks";
import { dashboardRoutes } from "../../routers";
import { Helmet } from "react-helmet-async";
const { Header, Content, Sider, Footer } = Layout;
const rootSubmenuKeys = [""];

const nombrePagina = import.meta.env.VITE_NOMBRE_PAGINA;
const version = import.meta.env.VITE_API_VERSION;

const DashboardLayout = ({ children }) => {

  const themeMode = "light";
  const navigate = useNavigate();
  const location = useLocation();
  const { userLoading, signOut, session, user } = useAuth();

  const [collapsed, setCollapsed] = React.useState(false);
  const [openKeys, setOpenKeys] = React.useState([""]);
  const [selectedKey, setSelectedKey] = React.useState("");
  const [breadcrumbItems, setBreadcrumbItems] = React.useState([]);
  const [titulo, setTitulo] = React.useState("");

  const dashStyles = {
    logoCollapsed: {
      height: 48,
      margin: 6,
      backgroundSize: 'contain',
      backgroundPosition: 'center center',
      transition: 'opacity 1s ease-in-out',
      backgroundImage: `url("/logo-collapsed.png")`,
      backgroundRepeat: 'no-repeat'
    },
    logo: {
      height: 48,
      margin: 14,
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center center',
      transition: 'opacity 1s ease-in-out',
      // backgroundImage: `url("/logo-light.png")`,
    },
    header: {
      padding: 0,
      background: "#fff",
    },
    trigger: {
      color: '#333',
      paddingLeft: 10
    },
    breadcrumb: {
      display: 'flex',
      alignItems: 'center',
      marginLeft: 5,
      height: '100%'
    },
    user: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingRight: 10,
    },
    footer: {
      textAlign: "center",
    },
  };

  const items = [
    {
      key: '1',
      label: (
        <Link to="/perfil">Configuración del perfil</Link>
      ),
      icon: <SettingOutlined />,
    },
    {
      key: '2',
      danger: true,
      label: 'Cerrar sesión',
      icon: <LoginOutlined />,
      onClick: () => {
        signOut();
        navigate("/");
      },
    },
  ];

  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  const sidebarMapper = (route) => {
    if (route.sidebar === "single") {
      return {
        key: route.path,
        icon: route.icon,
        label: route.name,
        onClick: () => {
          setSelectedKey(route.path);
          navigate(route.path);
        },
      };
    } else if (route.sidebar === "collapse") {
      const innerMap = (r) => ({ ...r, path: route.path + r.path });
      const finalKey = "collapse-" + route.path;
      return {
        key: finalKey,
        icon: route.icon,
        label: route.name,
        children: route.routes.map(innerMap).map(sidebarMapper),
      };
    }
    return null;
  };

  React.useEffect(() => {
    const rutasBreadCrumbs = (
      rutasOrig,
      rutaDividida,
      indice = 0,
      ruta = ""
    ) => {
      let rutas = [];
      let path = "";
      if (indice === 0) {
        return rutasBreadCrumbs(rutasOrig, rutaDividida, indice + 1);
      }
      if (indice > rutaDividida.length - 1) {
        return rutas;
      }
      if (rutaDividida.length >= indice + 1 && rutaDividida[indice] !== "") {
        path = rutasOrig?.find(
          (r) => r?.path?.indexOf(rutaDividida[indice]) !== -1
        );
        if (path !== undefined) {
          ruta += path?.path;
          rutas.push({
            title: path?.name,
            path: ruta,
            icon: path?.icon,
          });
        }
        rutas = [
          ...rutas,
          ...rutasBreadCrumbs(path?.routes, rutaDividida, indice + 1, ruta),
        ];
      }
      return rutas;
    };

    let rutas = [
      { title: "Inicio", path: "/", icon: <HomeOutlined /> },
      ...rutasBreadCrumbs(dashboardRoutes, location?.pathname?.split("/")),
    ];

    setTitulo(rutas[rutas?.length - 1]?.name);
    setBreadcrumbItems(rutas);
  }, [location?.pathname]);

  React.useEffect(() => {
    const flatter = (r) =>
      r?.routes
        ? [
            r,
            ...r?.routes
              .map((sub) => ({ ...sub, path: r.path + sub.path }))
              .flatMap(flatter),
          ]
        : r;
    const flatted = dashboardRoutes.flatMap(flatter);
    const paths = flatted.map((r) => r.path);
    const key = paths.find((path) => path === location?.pathname);
    setSelectedKey(key);
    const tmpOpenKeys = flatted
      .filter(
        (r) => r.sidebar === "collapse" && location?.pathname.includes(r.path)
      )
      .map((r) => "collapse-" + r.path);
    setOpenKeys(tmpOpenKeys);
  }, [location]);

  function itemRender(route) {
    // const last = route.path === items[items.length - 1]?.path;
    return  <Link id="RouterNavLink" to={route.path}>{route?.icon}<span> {route?.title} </span></Link>
  }
  
  if (!session && userLoading) return null;

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Helmet>
        <title>{titulo || ''} - {nombrePagina} </title>
      </Helmet>
      <Sider 
        trigger={null} 
        collapsible 
        theme={themeMode} 
        collapsed={collapsed}
        width={250}
      >
          <div style={collapsed ? dashStyles.logoCollapsed : { ...dashStyles.logo, backgroundImage: `url("/assets/logo.png")` }} >

          </div>

        <Menu
          theme={themeMode}
          mode="inline"
          openKeys={openKeys}
          onOpenChange={onOpenChange}
          selectedKeys={selectedKey}
          items={dashboardRoutes.map(sidebarMapper)}
        />
      </Sider>

      <Layout className="site-layout">
        <Header className="site-layout-background" style={dashStyles.header}>
          <Row>
            <Col xs={4} sm={4} md={2} lg={2} xxl={2} style={{ textAlign: 'center' }}>
              <Button
                type="link"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                style={dashStyles.trigger}
                onClick={() => setCollapsed(!collapsed)}
              />
            </Col>
            <Col xs={20} sm={20} md={16} lg={16} xxl={16}>
              <Breadcrumb
                style={dashStyles.breadcrumb} 
                itemRender={itemRender}
                items={breadcrumbItems}
              />
            </Col>
            <Col xs={24} sm={24} md={6} lg={6} xxl={6} style={{...dashStyles.user, display: 'flex', justifyContent: 'flex-end'}}>
              <Tooltip title={user?.nombre}>{`${user?.nombre}`}</Tooltip>
              <div style={{width:'15px'}}></div>
              <Dropdown style={{margin:'20px'}} menu={{ items }}>
                <Avatar shape="square" size={40} icon={<UserOutlined />} />
              </Dropdown>
            </Col>
          </Row>
        </Header>
        <Content
          className="site-layout-background"
          style={{ margin: 10, height: '100vh'}}
          children={children}
        />
        <Footer style={dashStyles.footer}>
          {version} - &copy; Derechos reservados.
        </Footer>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;