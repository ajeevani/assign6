import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { Row, Col, Pagination, Card } from 'react-bootstrap';
import ArtworkCard from '../../components/ArtworkCard';
import validObjectIDList from '@/public/data/validObjectIDList.json';

function Artwork() {
  const [artworkList, setArtworkList] = useState(null);
  const [page, setPage] = useState(1);
  const router = useRouter();
  const PER_PAGE = 12;

  let finalQuery = router.asPath.split('?')[1];
  const { data, error } = useSWR(`https://collectionapi.metmuseum.org/public/collection/v1/search?${finalQuery}`);

  useEffect(() => {
    if (data && data.objectIDs) {
      let filteredResults = validObjectIDList.objectIDs.filter(x =>
        data.objectIDs?.includes(x)
      );

      let results = [];
      for (let i = 0; i < filteredResults.length; i += PER_PAGE) {
        const chunk = filteredResults.slice(i, i + PER_PAGE);
        results.push(chunk);
      }

      setArtworkList(results);
      setPage(1);
    }
  }, [data]);

  if (error) return <Error statusCode={404} />;
  if (!artworkList) return null;

  const previousPage = () => setPage((prev) => (prev > 1 ? prev - 1 : prev));
  const nextPage = () => setPage((prev) => (prev < artworkList.length ? prev + 1 : prev));

  return (
    <>
      <Row className="gy-4">
        {artworkList.length > 0 ? artworkList[page - 1].map((id) => (
          <Col lg={3} key={id}>
            <ArtworkCard objectID={id} />
          </Col>
        )) : (
          <Card>
            <Card.Body>
              <h4>Nothing Here</h4>
              Try searching for something else.
            </Card.Body>
          </Card>
        )}
      </Row>
      {artworkList.length > 0 && (
        <Row>
          <Col>
            <Pagination>
              <Pagination.Prev onClick={previousPage} />
              <Pagination.Item>{page}</Pagination.Item>
              <Pagination.Next onClick={nextPage} />
            </Pagination>
          </Col>
        </Row>
      )}
    </>
  );
}

export default Artwork;