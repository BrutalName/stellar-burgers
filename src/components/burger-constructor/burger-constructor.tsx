import { FC, useMemo } from 'react';
import { TIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { RootState, AppDispatch } from '../../services/store';
import { useSelector, useDispatch } from 'react-redux';
import {
  orderBurgerThunk,
  clearOrder
} from '../../features/burger/burgerSlice';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const { constructorItems, orderRequest, orderModalData } = useSelector(
    (store: RootState) => store.burger
  );
  const { user } = useSelector((store: RootState) => store.user);
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const onOrderClick = () => {
    if (constructorItems.bun && constructorItems.ingredients.length !== 0) {
      if (!user) {
        navigate('/login');
      } else {
        const order = [
          constructorItems.bun._id,
          constructorItems.bun._id,
          ...constructorItems.ingredients.map((ingredient) => ingredient._id)
        ];
        dispatch(orderBurgerThunk(order));
      }
    }
  };

  const closeOrderModal = () => {
    if (!orderRequest) dispatch(clearOrder());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
