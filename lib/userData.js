import { getToken } from './authenticate';

async function requestWithToken(url, method = 'GET', body = null) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `JWT ${token}`,
  };

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  if (response.ok) {
    return response.json();
  } else {
    return [];
  }
}

export async function addToFavourites(id) {
  return requestWithToken(`/favourites/${id}`, 'PUT');
}

export async function removeFromFavourites(id) {
  return requestWithToken(`/favourites/${id}`, 'DELETE');
}

export async function getFavourites() {
  return requestWithToken('/favourites');
}

export async function addToHistory(id) {
  return requestWithToken(`/history/${id}`, 'PUT');
}

export async function removeFromHistory(id) {
  return requestWithToken(`/history/${id}`, 'DELETE');
}

export async function getHistory() {
  return requestWithToken('/history');
}