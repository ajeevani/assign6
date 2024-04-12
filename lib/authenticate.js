import { useState, useEffect } from 'react';

const CLIENT_ID = 'web422-authenticate';

function getFromStorage(key) {
  if (typeof window !== 'undefined') {
    return window.localStorage.getItem(key);
  }
  return null;
}

function setToStorage(key, value) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(key, value);
  }
}

function removeFromStorage(key) {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(key);
  }
}

export const setToken = (token) => {
  setToStorage(`${CLIENT_ID}_token`, token);
};

export const getToken = () => {
  return getFromStorage(`${CLIENT_ID}_token`);
};

export const removeToken = () => {
  removeFromStorage(`${CLIENT_ID}_token`);
};

export const readToken = () => {
  const token = getToken();
  if (!token) return null;
  let payload = JSON.parse(atob(token.split('.')[1]));
  return payload;
};

export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;
  const payload = readToken();
  if (!payload) return false;
  const currentTime = Date.now();
  const expirationTime = payload.exp * 1000;
  return currentTime < expirationTime;
};

export const authenticateUser = async (user, password) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userName: user, password: password }),
  });
  const data = await res.json();
  if (res.ok) {
    setToken(data.token);
    return true;
  } else {
    throw new Error(data.message);
  }
};

export const registerUser = async (user, password, password2) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userName: user, password: password, password2: password2 }),
  });
  const data = await res.json();
  if (res.ok) {
    return true;
  } else {
    throw new Error(data.message);
  }
};