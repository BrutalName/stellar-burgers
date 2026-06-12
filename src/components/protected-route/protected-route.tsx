import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { RootState } from '../../services/store';
import { Preloader } from '@ui';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  onlyAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
  onlyAuth = false,
  children
}: ProtectedRouteProps) => {
  const { user, isInit } = useSelector((store: RootState) => store.user);
  const location = useLocation();
  const background = location.state?.background;
  const backgroundFrom = location.state?.backgroundFrom;

  if (!isInit) {
    return <Preloader />;
  }

  if (onlyAuth && !user) {
    return (
      <Navigate
        replace
        to='/login'
        state={{ from: location, backgroundFrom: background }}
      />
    );
  }

  if (onlyUnAuth && user) {
    const from = location.state?.from || { pathname: '/' };
    return (
      <Navigate replace to={from} state={{ background: backgroundFrom }} />
    );
  }

  return children;
};
