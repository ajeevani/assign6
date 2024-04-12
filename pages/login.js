import { useState } from 'react';
import { useRouter } from 'next/router';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { authenticateUser } from '../lib/authenticate';
import { useAtom } from 'jotai';
import { favouritesAtom, searchHistoryAtom } from '../store';
import { getFavourites, getHistory } from '../lib/userData';

const Login = () => {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await authenticateUser(user, password);
      setFavouritesList(await getFavourites());
      setSearchHistory(await getHistory());
      router.push('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Card bg="light">
      <Card.Body>
        <h2>Login</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Username:</Form.Label>
            <Form.Control
              type="text"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Password:</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Button type="submit">Login</Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default Login;