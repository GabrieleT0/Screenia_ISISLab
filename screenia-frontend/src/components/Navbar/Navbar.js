import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { Container } from '@mui/material';
import { BrowserRouter, Routes ,Route, Navigate } from 'react-router-dom';
import OperePage from "../../pages/Opere";
import { mainListItems } from './listItems';
import OperaDetailsPageNew from '../../pages/OperaDetailsPageNew';
import TagPage from '../../pages/TagPage';
import AuthPage from "../../pages/Opere"
import LoginRegister from '../Auth/LoginRegister';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userAtom } from '../../state/user/userAtom';
import ProtectedRoute from '../Auth/ProtectedRoute';
import Logout from '../Auth/Logout';
import { selectorIsAuth } from '../../state/user/userSelector';
import DiscussionCommentPage from '../../pages/DiscussionCommentPage';
import UserApprovalePage from '../../pages/UserApprovalPage';
import authTokenAtom from '../../state/authToken/authTokenAtom';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function Navbar() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const user = useRecoilValue(userAtom);
  const [authToken, setAuthToken] = useRecoilState(authTokenAtom);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="fixed" open={open}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ mr: 2, ...(open && { display: 'none' }) }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Screenia
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
          variant="persistent"
          anchor="left"
          open={open}
        >
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List>
            {mainListItems(authToken, user)}
          </List>
        </Drawer>
        <Main open={open}>
          <DrawerHeader />
          <Container maxWidth="xl">
              <Routes>
                <Route path ='*' element={<OperePage />} />
                <Route exact path="/" element={<OperePage />}/>
                <Route exact path="/login" element={
                  authToken 
                    ? (<Navigate to="/" />)
                    : (<LoginRegister />)
                }/>
                <Route exact path="/logout" element={
                  !authToken 
                    ? (<Navigate to="/" />)
                    : (<Logout />)
                }/>
                <Route
                  path="/approval_user"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <UserApprovalePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/tags"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <TagPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="/opera">
                  <Route path=":id" element={
                    authToken 
                    ? (<ProtectedRoute allowedRoles={["editor", "admin"]}>
                        <OperaDetailsPageNew />
                      </ProtectedRoute>)
                    : <OperaDetailsPageNew />} >
                    <Route path=":paramIdBook" element={
                      authToken 
                      ? (<ProtectedRoute allowedRoles={["editor", "admin"]}>
                          <OperaDetailsPageNew />
                        </ProtectedRoute>)
                      : <OperaDetailsPageNew />} >
                      <Route path=":paramIdChapter" element={
                          authToken 
                          ? (<ProtectedRoute allowedRoles={["editor", "admin"]}>
                              <OperaDetailsPageNew />
                            </ProtectedRoute>)
                          : <OperaDetailsPageNew />} >
                        <Route path=":paramIdParagraph" element={
                          authToken 
                          ? (<ProtectedRoute allowedRoles={["editor", "admin"]}>
                              <OperaDetailsPageNew />
                            </ProtectedRoute>)
                          : <OperaDetailsPageNew />} />
                      </Route>
                    </Route>
                  </Route>
                </Route>
                <Route exact path="/room/:idRoom" element={<DiscussionCommentPage />}/>
              {/*<Route exact path="/room/:idCurrentComment" element={<DiscussionCommentPage />}/>
                <Route exact path="/approval_user" element={
                  <ProtectedRoute>
                    <UserApprovalePage />
                  </ProtectedRoute>}/>
                <Route exact path="/" element={
                  <ProtectedRoute>
                    <OperePage />
                  </ProtectedRoute>}/>
                <Route exact path="/tags" element={
                  <ProtectedRoute>
                    <TagPage />
                  </ProtectedRoute>}/>
                <Route path="/opera">
                  <Route path=":id" element={
                    <ProtectedRoute>
                      <OperaDetailsPageNew />
                    </ProtectedRoute>} >
                    <Route path=":paramIdBook" element={
                      <ProtectedRoute>
                        <OperaDetailsPageNew />
                      </ProtectedRoute>} >
                      <Route path=":paramIdChapter" element={
                          <ProtectedRoute>
                            <OperaDetailsPageNew />
                          </ProtectedRoute>} >
                        <Route path=":paramIdParagraph" element={
                          <ProtectedRoute>
                            <OperaDetailsPageNew />
                          </ProtectedRoute>} />
                      </Route>
                    </Route>
                  </Route>
                </Route>
                <Route exact path="/logout" element={
                  <ProtectedRoute>
                    <Logout />
                  </ProtectedRoute>}/>
                {!isAuth && <Route exact path="/login" element={<LoginRegister />}/>}*/}
              </Routes>
          </Container>
        </Main>
      </Box>
  );
}