import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { favouritesAtom } from '@/store';
import { addToFavourites, removeFromFavourites } from '@/lib/userData';
import useSWR from 'swr';
import { Card, Button } from 'react-bootstrap';
import Error from 'next/error';
import { isAuthenticated } from '@/lib/authenticate';
import { useRouter } from 'next/router';

const fetcher = url => fetch(url).then(res => res.json());

function ArtworkCardDetail({ objectID }) {
  const [showAdded, setShowAdded] = useState(false);
  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
  const router = useRouter();

  useEffect(() => {
    const authCheck = async () => {
      if (!isAuthenticated()) {
        await router.push('/login');
      }
    };

    authCheck();
  }, [router]);

  useEffect(() => {
    setShowAdded(favouritesList?.includes(objectID));
  }, [favouritesList]);

  const favouritesClicked = async () => {
    if (showAdded) {
      setFavouritesList(await removeFromFavourites(objectID));
    } else {
      setFavouritesList(await addToFavourites(objectID));
    }
    setShowAdded(!showAdded);
  };

  const { data, error } = useSWR(
    objectID ? `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}` : null,
    fetcher
  );

  if (error) return <Error statusCode={404} title="Artwork not found" />;
  if (!data) return <div>Loading...</div>;

  return (
    <Card>
      <Card.Img variant="top" src={data.primaryImageSmall || 'https://via.placeholder.com/375x375.png?text=Not+Available'} />
      <Card.Body>
        <Card.Title>{data.title || 'N/A'}</Card.Title>
        <Card.Text>
          Date: {data.objectDate || 'N/A'}
          <br />
          Classification: {data.classification || 'N/A'}
          <br />
          Medium: {data.medium || 'N/A'}
          <br /><br />
          Artist: {data.artistDisplayName || 'N/A'}  <a href={data.artistWikidata_URL} target="_blank" rel="noreferrer"> wiki</a>
          <br />
          Credit Line: {data.creditLine || 'N/A'}
          <br />
          Dimensions: {data.dimensions || 'N/A'}
          <br /><br />
          <Button
            variant={showAdded ? 'primary' : 'outline-primary'}
            onClick={favouritesClicked}
          >
            {showAdded ? '+ Favourite (added)' : '+ Favourite'}
          </Button>
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default ArtworkCardDetail;