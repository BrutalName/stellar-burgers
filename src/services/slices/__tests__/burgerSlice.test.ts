import { expect, test, jest, describe } from '@jest/globals';
import burgerSliceReducer, {
  addIngredient,
  changeIngredientsOrder,
  removeIngredientFromOrder,
  getIngredientsThunk,
  initialState
} from '../../../features/burger/burgerSlice';
import store from '../../store';
import * as ingredientsApi from '../../../utils/burger-api';

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mocked-id')
}));

const expectedResult = [
  {
    _id: '1',
    name: 'Булка',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: '',
    image_mobile: '',
    image_large: ''
  },
  {
    _id: '2',
    id: 'mocked-id',
    name: 'Добавка 1',
    type: 'main',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: '',
    image_mobile: '',
    image_large: ''
  },
  {
    _id: '3',
    id: 'mocked-id',
    name: 'Добавка 2',
    type: 'main',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: '',
    image_mobile: '',
    image_large: ''
  },
  {
    _id: '4',
    id: 'mocked-id',
    name: 'Добавка 3',
    type: 'main',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: '',
    image_mobile: '',
    image_large: ''
  }
];

const initialTracksState = {
  ...initialState
};

test('Тест неизвестного действия', () => {
  const initialStateUndefined = undefined;
  expect(
    burgerSliceReducer(initialStateUndefined, { type: 'UNKNOWN' })
  ).toEqual(initialState);
});

describe('Тесты конструктора бургера', () => {
  test('Добавление ингредиентов', async () => {
    const firstState = burgerSliceReducer(
      initialTracksState,
      addIngredient(expectedResult[0])
    );
    const finalState = burgerSliceReducer(
      firstState,
      addIngredient(expectedResult[1])
    );

    expect(finalState.constructorItems.bun).toEqual(expectedResult[0]);
    expect(finalState.constructorItems.ingredients[0]).toEqual(
      expectedResult[1]
    );
  });

  test('Изменениие порядка ингредиентов', async () => {
    const firstState = burgerSliceReducer(
      initialTracksState,
      addIngredient(expectedResult[1])
    );

    const secondState = burgerSliceReducer(
      firstState,
      addIngredient(expectedResult[2])
    );

    const finalState = burgerSliceReducer(
      secondState,
      changeIngredientsOrder({ index: 0, operation: 'down' })
    );

    expect(finalState.constructorItems.ingredients[0]).toEqual(
      expectedResult[2]
    );
  });

  test('Удаление ингредиентов', async () => {
    const firstState = burgerSliceReducer(
      initialTracksState,
      addIngredient(expectedResult[1])
    );

    const finalState = burgerSliceReducer(
      firstState,
      removeIngredientFromOrder({ id: 'mocked-id' })
    );

    expect(finalState.constructorItems.ingredients).toEqual([]);
  });
});

describe('Тесты асинхронных экшенов массива ингредиентов', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Обработка pending', async () => {
    const pendingAction = { type: getIngredientsThunk.pending.type };

    const newState = burgerSliceReducer(initialState, pendingAction);

    expect(newState.isLoading).toBe(true);
  });

  test('Обработка rejected', async () => {
    const rejectedAction = { type: getIngredientsThunk.rejected.type };

    const newState = burgerSliceReducer(initialState, rejectedAction);

    expect(newState.isLoading).toBe(false);
  });

  test('Обработка fulfilled', async () => {
    const fulfilledAction = {
      type: getIngredientsThunk.fulfilled.type,
      payload: expectedResult
    };

    const newState = burgerSliceReducer(initialState, fulfilledAction);

    expect(newState.isLoading).toBe(false);
    expect(newState.ingredients).toEqual(expectedResult);
  });

  test('Получение массива ингредиентов', async () => {
    const getingredientsMock = jest
      .spyOn(ingredientsApi, 'getIngredientsApi')
      .mockImplementation(() => Promise.resolve(expectedResult));

    await store.dispatch(getIngredientsThunk());

    const { ingredients } = store.getState().burger;

    expect(ingredients).toEqual(expectedResult);
    expect(getingredientsMock).toHaveBeenCalledTimes(1);
  });
});
