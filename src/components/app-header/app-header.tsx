import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from 'react-redux';
import { RootState } from '../../services/store';

export const AppHeader: FC = () => {
  const { user } = useSelector((store: RootState) => store.user);
  let userName = '';
  if (user) userName = user.name;
  return <AppHeaderUI userName={userName} />;
};
