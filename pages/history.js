import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAtom } from 'jotai';
import { searchHistoryAtom } from '@/store';
import { removeFromHistory } from '@/lib/userData';
import { Card, Button } from 'react-bootstrap';
import { isAuthenticated } from '@/lib/authenticate';

const History = () => {
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
  const router = useRouter();

  useEffect(() => {
    const authCheck = async () => {
      if (!isAuthenticated()) {
        await router.push('/login');
      }
    };

    authCheck();
  }, [router]);

  if (!searchHistory) return null;

  const removeHistoryClicked = async (index) => {
    setSearchHistory(await removeFromHistory(searchHistory[index]));
  };

  return (
    <div>
      <h2>Search History</h2>
      {searchHistory.length > 0 ? (
        <ul>
          {searchHistory.map((query, index) => (
            <li key={index}>
              <Button variant="link" onClick={() => router.push(`/search?${query}`)}>
                {query}
              </Button>
              <Button variant="danger" size="sm" onClick={() => removeHistoryClicked(index)}>
                &times;
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <Card>
          <Card.Body>
            <h4>Nothing Here</h4>
            Try searching for some artworks.
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default History;