#### Docs

[Redux Toolkit Docs](https://redux-toolkit.js.org/introduction/getting-started)

#### Install Template

```sh
npx create-react-app my-app --template redux
```

- @latest

```sh
npx create-react-app@latest my-app --template redux
```

#### Existing NextJS App

```sh
yarn add @reduxjs/toolkit react-redux redux-thunk next-redux-wrapper
```

#### @reduxjs/toolkit

consists of few libraries

- redux (core library, state management)
- immer (allows to mutate state)
- redux-thunk (handles async actions)
- reselect (simplifies reducer functions)

#### Extras

- redux devtools
- combine reducers

#### react-redux

connects our app to redux

#### Start Store Setup

- create a store folder
- create store.ts file

```ts
import { configureStore } from "@reduxjs/toolkit";
import thunkMiddleware from "redux-thunk";
import { createWrapper } from "next-redux-wrapper";

const combineReducer = combineReducers({});
export const makeStore = () => configureStore({});
export const store = configureStore({
  reducer: {},
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
export const wrapper = createWrapper(makeStore);
// Infer the `RootState` and `AppDispatch` types from the store itself
export type AppState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
```

#### Setup Provider

- app.tsx

```ts
import "../styles/globals.css";
import "../styles/app.css";
import type { AppProps } from "next/app";
import { store } from "../store/store";
import { Provider } from "react-redux";
import { wrapper } from "../store/store";
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default wrapper.withRedux(MyApp);
```

#### Setup Cart Slice

- storee
- inside store folder create cart folder
- create cartSlice.js

```ts
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
  amount: 0,
  total: 0,
  isLoading: true,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
});

export default cartSlice.reducer;
```

- store.ts

```ts
import { configureStore } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";
import thunkMiddleware from "redux-thunk";
import { createWrapper } from "next-redux-wrapper";

const combineReducer = combineReducers({
  cart: cartReducer,
});
export const makeStore = () =>
  configureStore({
    reducer: combineReducer,
    middleware: [thunkMiddleware],
  });
export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
export const wrapper = createWrapper(makeStore);
// Infer the `RootState` and `AppDispatch` types from the store itself
export type AppState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
```

#### Redux DevTools

- extension

#### Access store value

- create components/Navbar.js

```js
import { CartIcon } from "../icons";
import { useSelector } from "react-redux";

const Navbar = () => {
  const { amount } = useSelector((state) => state.cart);
  return (
    <nav>
      <div className="nav-center">
        <h3>Redux Toolkit Demo App</h3>
        <div className="nav-container">
          <CartIcon />
          <div className="amount-container">
            <p className="total-amount">{amount}</p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
```

#### Hero Icons

- [Hero Icons](https://heroicons.com/)

```css
nav svg {
  width: 40px;
  color: var(--clr-white);
}
```

#### Setup Cart

- cartSlice.js

```js
import cartItems from "../../cartItems";

const initialState = {
  cartItems: cartItems,
  amount: 0,
  total: 0,
  isLoading: true,
};
```

- create CartContainer.js and CartItem.js
- CartContainer.js

```js
import React from "react";
import CartItem from "./CartItem";
import { useSelector } from "react-redux";

const CartContainer = () => {
  const { cartItems, total, amount } = useSelector((state) => state.cart);

  if (amount < 1) {
    return (
      <section className="cart">
        {/* cart header */}
        <header>
          <h2>your bag</h2>
          <h4 className="empty-cart">is currently empty</h4>
        </header>
      </section>
    );
  }
  return (
    <section className="cart">
      {/* cart header */}
      <header>
        <h2>your bag</h2>
      </header>
      {/* cart items */}
      <div>
        {cartItems.map((item) => {
          return <CartItem key={item.id} {...item} />;
        })}
      </div>
      {/* cart footer */}
      <footer>
        <hr />
        <div className="cart-total">
          <h4>
            total <span>${total}</span>
          </h4>
        </div>
        <button className="btn clear-btn">clear cart</button>
      </footer>
    </section>
  );
};

export default CartContainer;
```

- CartItems.js

```js
import React from "react";
import { ChevronDown, ChevronUp } from "../icons";

const CartItem = ({ id, img, title, price, amount }) => {
  return (
    <article className="cart-item">
      <img src={img} alt={title} />
      <div>
        <h4>{title}</h4>
        <h4 className="item-price">${price}</h4>
        {/* remove button */}
        <button className="remove-btn">remove</button>
      </div>
      <div>
        {/* increase amount */}
        <button className="amount-btn">
          <ChevronUp />
        </button>
        {/* amount */}
        <p className="amount">{amount}</p>
        {/* decrease amount */}
        <button className="amount-btn">
          <ChevronDown />
        </button>
      </div>
    </article>
  );
};

export default CartItem;
```

#### First Reducer

- cartSlice.js
- Immer library

```js
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cartItems = [];
    },
  },
});

export const { clearCart } = cartSlice.actions;
```

- create action

```js
const ACTION_TYPE = "ACTION_TYPE";

const actionCreator = (payload) => {
  return { type: ACTION_TYPE, payload: payload };
};
```

- CartContainer.js

```js
import React from "react";
import CartItem from "./CartItem";
import { useDispatch, useSelector } from "react-redux";

const CartContainer = () => {
  const dispatch = useDispatch();

  return (
    <button
      className="btn clear-btn"
      onClick={() => {
        dispatch(clearCart());
      }}
    >
      clear cart
    </button>
  );
};

export default CartContainer;
```

#### Remove, Increase, Decrease

- cartSlice.js

```js
import { createSlice } from "@reduxjs/toolkit";
import cartItems from "../../cartItems";

const initialState = {
  cartItems: [],
  amount: 0,
  total: 0,
  isLoading: true,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cartItems = [];
    },
    removeItem: (state, action) => {
      const itemId = action.payload;
      state.cartItems = state.cartItems.filter((item) => item.id !== itemId);
    },
    increase: (state, { payload }) => {
      const cartItem = state.cartItems.find((item) => item.id === payload.id);
      cartItem.amount = cartItem.amount + 1;
    },
    decrease: (state, { payload }) => {
      const cartItem = state.cartItems.find((item) => item.id === payload.id);
      cartItem.amount = cartItem.amount - 1;
    },
    calculateTotals: (state) => {
      let amount = 0;
      let total = 0;
      state.cartItems.forEach((item) => {
        amount += item.amount;
        total += item.amount * item.price;
      });
      state.amount = amount;
      state.total = total;
    },
  },
});

export const { clearCart, removeItem, increase, decrease, calculateTotals } =
  cartSlice.actions;

export default cartSlice.reducer;
```

- CartItem.js

```js
import React from "react";
import { ChevronDown, ChevronUp } from "../icons";

import { useDispatch } from "react-redux";
import { removeItem, increase, decrease } from "../store/cart/cartSlice";

const CartItem = ({ id, img, title, price, amount }) => {
  const dispatch = useDispatch();

  return (
    <article className="cart-item">
      <img src={img} alt={title} />
      <div>
        <h4>{title}</h4>
        <h4 className="item-price">${price}</h4>
        {/* remove button */}
        <button
          className="remove-btn"
          onClick={() => {
            dispatch(removeItem(id));
          }}
        >
          remove
        </button>
      </div>
      <div>
        {/* increase amount */}
        <button
          className="amount-btn"
          onClick={() => {
            dispatch(increase({ id }));
          }}
        >
          <ChevronUp />
        </button>
        {/* amount */}
        <p className="amount">{amount}</p>
        {/* decrease amount */}
        <button
          className="amount-btn"
          onClick={() => {
            if (amount === 1) {
              dispatch(removeItem(id));
              return;
            }
            dispatch(decrease({ id }));
          }}
        >
          <ChevronDown />
        </button>
      </div>
    </article>
  );
};

export default CartItem;
```

- index.tsx

```js
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import CartContainer from "./components/CartContainer";
import { useSelector, useDispatch } from "react-redux";
import { calculateTotals } from "../store/cart/cartSlice";

const Home: NextPage = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(calculateTotals());
  }, [cartItems]);

  return (
    <main>
      <Navbar />
      <CartContainer />
    </main>
  );
};

export default Home;
```

#### Modal

- create components/Modal.js

```js
const Modal = () => {
  return (
    <aside className="modal-container">
      <div className="modal">
        <h4>Remove all items from your shopping cart?</h4>
        <div className="btn-container">
          <button type="button" className="btn confirm-btn">
            confirm
          </button>
          <button type="button" className="btn clear-btn">
            cancel
          </button>
        </div>
      </div>
    </aside>
  );
};
export default Modal;
```

- index.tsx

```tsx
return (
  <div>
    <Head>
      <title>RedxToolkit App</title>
      <meta name="description" content="Generated by create next app" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <main>
      <Modal />
      <Navbar />
      <CartContainer />
    </main>
  </div>
);
```

#### modal slice

- create store/modal/modalSlice.ts

```js
import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  isOpen: false,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (state, action) => {
      state.isOpen = true;
    },
    closeModal: (state, action) => {
      state.isOpen = false;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
```

#### Finish Store Setup

```ts
mport { configureStore, combineReducers } from "@reduxjs/toolkit";
import thunkMiddleware from "redux-thunk";
import { createWrapper } from "next-redux-wrapper";
import cartReducer from "./cart/cartSlice";
import modalReducer from "./modal/modalSlice";

const combineReducer = combineReducers({
  cart: cartReducer,
  modal: modalReducer,
});

export const makeStore = () =>
  configureStore({
    reducer: combineReducer,
    middleware: [thunkMiddleware],
  });
export const wrapper = createWrapper(makeStore);

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    modal: modalReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type AppState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
```

- index.tsx

```tsx
const { isOpen } = useSelector((store: AppState) => state.modal);

return (
  <div>
    <Head>
      <title>RedxToolkit App</title>
      <meta name="description" content="Generated by create next app" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <main>
      <Modal />
      <Navbar />
      <CartContainer />
    </main>
  </div>
);
```

#### toggle modal

- CartContainer.js

```js
import { openModal } from "../store/modal/modalSlice";

return (
  <button
    className="btn clear-btn"
    onClick={() => {
      dispatch(openModal());
    }}
  >
    clear cart
  </button>
);
```

- Modal.js

```js
import { closeModal } from "../store/modal/modalSlice";
import { useDispatch } from "react-redux";
import { clearCart } from "../store/cart/cartSlice";

const Modal = () => {
  const dispatch = useDispatch();

  return (
    <aside className="modal-container">
      <div className="modal">
        <h4>Remove all items from your shopping cart?</h4>
        <div className="btn-container">
          <button
            type="button"
            className="btn confirm-btn"
            onClick={() => {
              dispatch(clearCart());
              dispatch(closeModal());
            }}
          >
            confirm
          </button>
          <button
            type="button"
            className="btn clear-btn"
            onClick={() => {
              dispatch(closeModal());
            }}
          >
            cancel
          </button>
        </div>
      </div>
    </aside>
  );
};
export default Modal;
```

#### async functionality with createAsyncThunk

- [Course API](https://course-api.com/)
- https://course-api.com/react-useReducer-cart-project
- cartSlice.js

- action type
- callback function
- lifecycle actions

```js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const url = "https://course-api.com/react-useReducer-cart-project";

export const getCartItems = createAsyncThunk("cart/getCartItems", () => {
  return fetch(url)
    .then((resp) => resp.json())
    .catch((err) => console.log(error));
});

const cartSlice = createSlice({
  name: "cart",
  initialState,
  extraReducers: {
    [getCartItems.pending]: (state) => {
      state.isLoading = true;
    },
    [getCartItems.fulfilled]: (state, action) => {
      console.log(action);
      state.isLoading = false;
      state.cartItems = action.payload;
    },
    [getCartItems.rejected]: (state) => {
      state.isLoading = false;
    },
  },
});
```

- index.tsx

```js
import { calculateTotals, getCartItems } from "../store/cart/cartSlice";

const Home: NextPage = () => {
  const { cartItems, isLoading } = useSelector((store: AppState) => state.cart);

  useEffect(() => {
    dispatch(getCartItems());
  }, []);

  if (isLoading) {
    return (
          return <Loading />;
    );
  }

  return (
    <div>
      <Head>
        <title>RedxToolkit App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {isOpen && <Modal />}
        <Navbar />
        <CartContainer />
      </main>
    </div>
  );
};

export default Home;
```

#### Options

```sh
npm install axios
```

- cartSlice.js

```js
export const getCartItems = createAsyncThunk(
  "cart/getCartItems",
  async (name, thunkAPI) => {
    try {
      const response = await axios(url);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("something went wrong");
    }
  }
);
```
