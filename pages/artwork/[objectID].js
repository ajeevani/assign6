import { useRouter } from 'next/router';
import { Row, Col } from 'react-bootstrap';
import ArtworkCardDetail from '../../components/ArtworkCardDetail';

function ArtworkById() {
  const router = useRouter();
  const { objectID } = router.query;

  if (!objectID) {
    return <div>Loading...</div>;
  }

  return (
    <Row>
      <Col>
        <ArtworkCardDetail objectID={objectID} />
      </Col>
    </Row>
  );
}

export default ArtworkById;

