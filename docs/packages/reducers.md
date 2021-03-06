# Reducers

> yarn add @redux-syringe/reducers

This package provides a store enhancer for injecting reducers into a Redux store after the store is created.

## Usage Example

```js
import { createStore } from 'redux';
import { makeEnhancer } from '@redux-syringe/reducers';

const initialState = {
	value: 0,
};

const counterReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'increment':
			return { ...state, value: state.value + 1 };
		default:
			return state;
	}
};

const store = createStore(state => state, makeEnhancer());

store.injectReducers({ counter: counterReducer });
```

## API Reference

### makeEnhancer()

A function which creates an enhancer to pass to `createStore()`.

#### store.injectReducers()

This function will store passed reducers internally and replace the existing reducer with a fresh one.

**Parameters**

1. `reducers` ( _Function|Array|Object_ ): Reducers to inject
2. `options` ( _Object_ ): Injection options. The following keys are supported:
   - [`namespace`] \( _string_ ): Namespace to inject the reducer under. If passed, the reducer will not handle actions from other namespaces and will store its state in `state.namespaces[namespace]` instead of in the root.
   - [`feature`] \( _string_ ): This string will be used instead of the default `namespaces` key to store the reducer state, allowing you to use Redux Syringe for feature-based store structure (similar to Redux Form, e.g. `state.form.contact.values`).

#### store.ejectReducers()

Opposite to `store.injectReducers`. This function will remove the injected reducers. Make sure that you pass the correct namespace and reducers (keys and values), otherwise the reducers will not be removed.

**Parameters**

1. `reducers` ( _Function|Array|Object_ ): Reducers to eject. Make sure that both the keys and values match the injected ones.
2. `options` ( _Object_ ): Ejection options. The following keys are supported:
   - [`namespace`] \( _string_ ): Namespace the reducers were injected under.
   - [`feature`] \( _string_ ): Namespace the reducers were injected under.
