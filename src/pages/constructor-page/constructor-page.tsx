import { useSelector } from '../../services/store';
import { RootState } from '../../services/store';

import { ConstructorPageUI } from '../../components/ui/pages/constructor-page';
import { FC } from 'react';

export const ConstructorPage: FC = () => {
  const { isInit } = useSelector((store: RootState) => store.user);

  return <ConstructorPageUI isIngredientsLoading={!isInit} />;
};
