import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { Button, Form, Row, Col } from 'react-bootstrap';
import { useAtom } from 'jotai';
import { searchHistoryAtom } from '../store';
import { addToHistory } from '@/lib/userData';
import { isAuthenticated } from '@/lib/authenticate';

function AdvancedSearch() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    mode: "onTouched"
  });
  const router = useRouter();
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);

  useEffect(() => {
    const authCheck = async () => {
      if (!isAuthenticated()) {
        await router.push('/login');
      }
    };

    authCheck();
  }, [router]);

  const submitForm = async (data) => {
    let queryString = `${Object.entries(data)
      .filter(([_, value]) => value !== '' && value !== false)
      .map(([key, value]) => `${key}=${value === true ? 'true' : encodeURIComponent(value)}`)
      .join('&')}`;

    setSearchHistory(await addToHistory(queryString));
    router.push(`/search?${queryString}`);
  };

  return (
    <Form onSubmit={handleSubmit(submitForm)}>
      <Row>
        <Col>
          <Form.Group>
            <Form.Label>Search Query</Form.Label>
            <Form.Control 
              type="text"
              {...register('q', { required: "Search query is required." })}
              isInvalid={!!errors.q}
            />
            <Form.Control.Feedback type="invalid">
              {errors.q?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Search By</Form.Label>
            <Form.Select {...register('searchBy')}>
              <option value="title">Title</option>
              <option value="tags">Tags</option>
              <option value="artistculture">Artist or Culture</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Geo Location</Form.Label>
            <Form.Control type="text" {...register('geoLocation')} placeholder="Enter geo location" />
            <Form.Text>
            Case Sensitive String (ie "Europe", "France", "Paris", "China", "New York", etc.), with multiple values separated by the | operator
            </Form.Text>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Medium</Form.Label>
            <Form.Control type="text" {...register('medium')} placeholder="Enter medium" />
            <Form.Text>
            Case Sensitive String (ie: "Ceramics", "Furniture", "Paintings", "Sculpture", "Textiles", etc.), with multiple values separated by the | operator
            </Form.Text>
          </Form.Group>
        </Col>
      </Row>

      <Form.Group>
        <Form.Check type="checkbox" label="Highlighted" {...register('isHighlight')} />
      </Form.Group>

      <Form.Group>
        <Form.Check  type="checkbox" label="Currently on View" {...register('isOnView')} />
      </Form.Group>
      <br />
      <Button type="submit">Submit</Button>
    </Form>
  );
}

export default AdvancedSearch;