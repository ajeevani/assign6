import { Container } from 'react-bootstrap';
import MainNav from './MainNav';

function Layout({ children }) {
  return (
    <>
      <MainNav />
      <br />
      <Container>
        {children}
      </Container>
      <br />
    </>
  );
}

export default Layout;
