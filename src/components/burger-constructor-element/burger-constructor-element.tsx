import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import {
  changeIngredientsOrder,
  removeIngredientFromOrder
} from '../../features/burger/burgerSlice';
import { useDispatch } from 'react-redux';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();

    const handleMoveDown = () => {
      dispatch(changeIngredientsOrder({ index: index, operation: 'down' }));
    };

    const handleMoveUp = () => {
      dispatch(changeIngredientsOrder({ index: index, operation: 'up' }));
    };

    const handleClose = () => {
      dispatch(removeIngredientFromOrder({ index: index }));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
