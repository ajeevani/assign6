import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { isAuthenticated, removeToken } from '../lib/authenticate';
import { getFavourites, getHistory } from '../lib/userData';
import { useAtom } from 'jotai';
import { favouritesAtom, searchHistoryAtom } from '../store';

const PUBLIC_PATHS = ['/', '/register', '/login', '/search', '/artwork'];

export const RouteGuard = ({ children }) => {
  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
  const router = useRouter();

  const updateAtoms = async () => {
    setFavouritesList(await getFavourites());
    setSearchHistory(await getHistory());
  };

  useEffect(() => {
    const authCheck = async () => {
      const isAuth = isAuthenticated();
      const path = router.pathname;

      if (!isAuth && !PUBLIC_PATHS.includes(path)) {
        await router.push('/login');
      } else if (isAuth && (path === '/login' || path === '/register')) {
        await router.push('/');
      } else if (isAuth) {
        try {
          await updateAtoms();
        } catch (error) {
          // Handle expired token or authentication error
          removeToken(); // Remove the expired token
          await router.push('/login'); // Redirect to the login page
        }
      }
    };

    authCheck();
  }, [router.pathname, router.query]);

  return <>{children}</>;
};