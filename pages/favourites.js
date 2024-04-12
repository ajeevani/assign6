import { useAtom } from 'jotai';
import { favouritesAtom } from '@/store';
import { Row, Col, Card } from 'react-bootstrap';
import ArtworkCard from '../components/ArtworkCard';
import { useEffect } from 'react';
import { isAuthenticated } from '@/lib/authenticate';
import { useRouter } from 'next/router';

const Favourites = () => {
  const [favouritesList] = useAtom(favouritesAtom);
  const router = useRouter();

  useEffect(() => {
    const authCheck = async () => {
      if (!isAuthenticated()) {
        await router.push('/login');
      }
    };

    authCheck();
  }, [router]);

  if (!favouritesList) return null;

  return (
    <Row className="gy-4">
      {favouritesList.length > 0 ? (
        favouritesList.map(id => (
          <Col lg={3} key={id}>
            <ArtworkCard objectID={id} />
          </Col>
        ))
      ) : (
        <Card>
          <Card.Body>
            <h4>Nothing Here</h4>
            Try adding some new artwork to the list.
          </Card.Body>
        </Card>
      )}
    </Row>
  );
};

export default Favourites;