import { Container, Navbar, Nav, Form, FormControl, Button, NavDropdown } from 'react-bootstrap';
import Link from 'next/link';
import { readToken, removeToken } from '@/lib/authenticate';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useAtom } from 'jotai';
import { searchHistoryAtom } from '../store';
import { addToHistory } from '@/lib/userData';

const MainNav = () => {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
  const [searchValue, setSearchValue] = useState('');
  const token = readToken();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const searchField = e.currentTarget.search.value;
    setSearchValue('');
    setSearchHistory(await addToHistory(`title=true&q=${searchField}`));
    router.push(`/artwork?title=true&q=${searchField}`);
    setIsExpanded(false);
  };

  const logout = () => {
    removeToken();
    router.push('/');
    setIsExpanded(false);
  };

  return (
    <Navbar bg="primary" variant="dark" expand="lg" fixed-top expanded={isExpanded}>
      <Container>
        <Navbar.Brand>Arman Jeevani</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" onClick={() => setIsExpanded(!isExpanded)} />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto">
            <Link legacyBehavior href="/" passHref>
              <Nav.Link active={router.pathname === '/'} onClick={() => setIsExpanded(false)}>
                Home
              </Nav.Link>
            </Link>
            {token && (
              <Link legacyBehavior href="/search" passHref>
                <Nav.Link active={router.pathname === '/search'} onClick={() => setIsExpanded(false)}>
                  Advanced Search
                </Nav.Link>
              </Link>
            )}
          </Nav>
          {token && (
            <Form className="d-flex mx-auto" onSubmit={handleSubmit}>
              <FormControl
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
                name="search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <Button variant="outline-success" type="submit">
                Search
              </Button>
            </Form>
          )}
          <Nav>
            {token ? (
              <NavDropdown title={token.userName} id="basic-nav-dropdown">
                <Link legacyBehavior href="/favourites" passHref>
                  <NavDropdown.Item active={router.pathname === '/favourites'} onClick={() => setIsExpanded(false)}>
                    Favourites
                  </NavDropdown.Item>
                </Link>
                <Link legacyBehavior href="/history" passHref>
                  <NavDropdown.Item active={router.pathname === '/history'} onClick={() => setIsExpanded(false)}>
                    Search History
                  </NavDropdown.Item>
                </Link>
                <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Link legacyBehavior href="/register" passHref>
                  <Nav.Link active={router.pathname === '/register'} onClick={() => setIsExpanded(false)}>
                    Register
                  </Nav.Link>
                </Link>
                <Link legacyBehavior href="/login" passHref>
                  <Nav.Link active={router.pathname === '/login'} onClick={() => setIsExpanded(false)}>
                    Login
                  </Nav.Link>
                </Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MainNav;