import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getIngredientsApi,
  getFeedsApi,
  getOrdersApi,
  orderBurgerApi
} from '../../utils/burger-api';
import { TIngredient, TOrder } from '../../utils/types';

export const getIngredientsThunk = createAsyncThunk(
  '/ingredients',
  async () => await getIngredientsApi()
);

export const getFeedsThunk = createAsyncThunk(
  '/feeds',
  async () => await getFeedsApi()
);

export const getOrdersThunk = createAsyncThunk(
  '/orders',
  async () => await getOrdersApi()
);

export const orderBurgerThunk = createAsyncThunk(
  '/order',
  async (order: string[]) => await orderBurgerApi(order)
);

type TFeeds = {
  orders: TOrder[];
  total: number;
  totalToday: number;
};

interface BurgerState {
  isLoading: boolean;
  orderRequest: boolean;
  ingredients: TIngredient[];
  feeds: TFeeds;
  orderTitle: string;
  error: string | null;
  orders: TOrder[];
  orderData: TOrder | null;
  orderModalData: TOrder | null;
  constructorItems: {
    bun: TIngredient | null;
    ingredients: TIngredient[];
  };
}

const initialState: BurgerState = {
  isLoading: false,
  orderRequest: false,
  ingredients: [],
  orders: [],
  orderData: null,
  orderModalData: null,
  feeds: {
    orders: [],
    total: 0,
    totalToday: 0
  },
  orderTitle: '',
  error: null,
  constructorItems: {
    bun: null,
    ingredients: []
  }
};

function moveItemUp<T>(array: T[], index: number, operation: 'up' | 'down') {
  switch (operation) {
    case 'up':
      [array[index - 1], array[index]] = [array[index], array[index - 1]];
      break;
    case 'down':
      [array[index], array[index + 1]] = [array[index + 1], array[index]];
      break;
  }
}

function removeItemByIndex<T>(array: T[], index: number): T[] {
  return array.filter((_, i) => i !== index);
}

export const burgerSlice = createSlice({
  name: 'burger',
  initialState,
  reducers: {
    addIngredient: (state, action) => {
      if (action.payload.type === 'bun') {
        state.constructorItems.bun = action.payload;
      } else {
        state.constructorItems.ingredients.push(action.payload);
      }
    },
    changeIngredientsOrder: (state, action) => {
      const { index, operation } = action.payload;
      const ingredients = state.constructorItems.ingredients;
      moveItemUp<TIngredient>(ingredients, index, operation);
    },
    removeIngredientFromOrder: (state, action) => {
      const { index } = action.payload;
      const ingredients = state.constructorItems.ingredients;
      state.constructorItems.ingredients = removeItemByIndex<TIngredient>(
        ingredients,
        index
      );
    },
    clearOrder: (state) => {
      state.orderModalData = null;
      state.constructorItems = {
        bun: null,
        ingredients: []
      };
    },
    setOrderTitle: (state, action) => {
      state.orderTitle = action.payload;
    },
    getOrderData: (state, action) => {
      if (state.feeds.orders.length) {
        state.orderData =
          state.feeds.orders.find(
            (order) => String(order.number) === action.payload
          ) || null;
      } else
        state.orderData =
          state.orders.find(
            (order) => String(order.number) === action.payload
          ) || null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getIngredientsThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getIngredientsThunk.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(getIngredientsThunk.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.ingredients = [...payload];
    });
    builder.addCase(getFeedsThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getFeedsThunk.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(getFeedsThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      const { orders, total, totalToday } = action.payload;
      state.feeds = { orders, total, totalToday };
    });
    builder.addCase(getOrdersThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getOrdersThunk.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(getOrdersThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.orders = action.payload;
    });
    builder.addCase(orderBurgerThunk.pending, (state) => {
      state.isLoading = true;
      state.orderRequest = true;
    });
    builder.addCase(orderBurgerThunk.rejected, (state) => {
      state.isLoading = false;
      state.orderRequest = false;
    });
    builder.addCase(orderBurgerThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.orderRequest = false;
      state.orderModalData = {
        _id: action.payload.order._id,
        status: action.payload.order.status,
        name: action.payload.order.name,
        createdAt: action.payload.order.createdAt,
        updatedAt: action.payload.order.updatedAt,
        number: action.payload.order.number,
        ingredients: []
      };
    });
  }
});

export const {
  addIngredient,
  changeIngredientsOrder,
  removeIngredientFromOrder,
  clearOrder,
  setOrderTitle,
  getOrderData
} = burgerSlice.actions;

export default burgerSlice.reducer;
