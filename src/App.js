import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import './App.css';
import Routes from './Routes';
import { UserContext } from './libs/contextLib';
import { Auth } from 'aws-amplify';
import { onError } from './libs/errorLib';

function App() {
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const history = useHistory();

  useEffect(() => {
    const onLoad = async () => {
      try {
        await Auth.currentSession();
        userHasAuthenticated(true);
      } catch (err) {
        if (err !== 'No current user') {
          onError(err);
        }
      }
      setIsAuthenticating(false);
    }
    onLoad();
  }, []);

  const handleLogout = async () => {
    await Auth.signOut();
    userHasAuthenticated(false);
    history.push('/login');
  }
  return (
    !isAuthenticating &&
    <div className="App container">
      <Navbar fluid collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/">L@MBD@</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav pullRight>
            {isAuthenticated
            ? <>
                <LinkContainer to="/notes/new">
                  <NavItem>New Note</NavItem>
                </LinkContainer>
                <NavItem onClick={handleLogout}>Logout</NavItem>
              </>
            : <>
                <LinkContainer to="/signup">
                  <NavItem>Signup</NavItem>
                </LinkContainer>
                <LinkContainer to="/login">
                  <NavItem>Login</NavItem>
                </LinkContainer>
              </>}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <UserContext.Provider value={{ isAuthenticated, userHasAuthenticated }}>
        <Routes />
      </UserContext.Provider>
    </div>
  );
}

export default App;
