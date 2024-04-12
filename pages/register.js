import { useState } from 'react';
import { useRouter } from 'next/router';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { registerUser } from '../lib/authenticate';

const Register = () => {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== password2) {
      setError('Passwords do not match');
      return;
    }

    try {
      await registerUser(user, password, password2);
      router.push('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Card bg="light">
      <Card.Body>
        <h2>Register</h2>
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
          <Form.Group>
            <Form.Label>Confirm Password:</Form.Label>
            <Form.Control
              type="password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              required
            />
          </Form.Group>
          <Button type="submit">Register</Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default Register;