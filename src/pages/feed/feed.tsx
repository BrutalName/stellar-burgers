import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import React, { FC, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../services/store';
import { getFeedsThunk } from '../../features/burger/burgerSlice';

export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  const { feeds } = useSelector((store: RootState) => store.burger);
  const dispatch: AppDispatch = useDispatch();
  const orders: TOrder[] = feeds.orders;

  const handleClick = () => {
    dispatch(getFeedsThunk());
  };

  useEffect(() => {
    dispatch(getFeedsThunk());
  }, []);

  return <FeedUI orders={orders} handleGetFeeds={handleClick} />;
};
