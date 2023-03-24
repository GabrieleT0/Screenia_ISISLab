import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { Link } from 'react-router-dom';
import TagIcon from '@mui/icons-material/Tag';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';

const allRoles = ["user", "editor", "admin"]

const routes = [
    {
        title: "Home",
        path: "/",
        icon: (<DashboardIcon color="primary" />),
        isPrivate: false,
        roles: allRoles
    },
    {
      title: "Tags",
      path: "/tags",
      icon: (<TagIcon color="primary" />),
      roles: ["admin"],
      isPrivate: true
    },
    {
      title: "Users to approve",
      path: "/approval_user",
      icon: (<HowToRegIcon color="primary" />),
      roles: ["admin"],
      isPrivate: true
    },
    {
      title: "Login",
      path: "/login",
      icon: (<LogoutIcon color="primary" />),
      isPrivate: false
    },
    {
      title: "Logout",
      path: "/logout",
      icon: (<ExitToAppIcon color="primary" />),
      isPrivate: true,
      roles: allRoles
    }
]

export const mainListItems = (isAuth, user, handleClickItem) => {
  const homeRoute = routes.find(({ title }) => title.toLowerCase() === "home");
  const noAuthRoutes = routes.filter((route) => !route.isPrivate);
  const authRoutes = routes.filter((route) => route.isPrivate);
  authRoutes.unshift(homeRoute);

  if(!isAuth) {
    return (noAuthRoutes.map(({ title, path, icon }) => (
      <ListItemButton key={title} component={Link} to={path} onClick={handleClickItem}>
        <ListItemIcon>
            {icon}
        </ListItemIcon>
        <ListItemText primary={title} />
      </ListItemButton>)
    ))
  }

  return authRoutes.map(({ title, path, icon, roles }) => {
    if(user && user.role && roles.includes(user.role.toLowerCase())) {
      return (
        <ListItemButton key={title} component={Link} to={path}>
          <ListItemIcon>
              {icon}
          </ListItemIcon>
        <ListItemText primary={title} />
      </ListItemButton>)
    }
  })
}