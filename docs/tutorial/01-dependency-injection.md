# Dependency Injection {docsify-ignore-all}

> Dependency injection is one form of the broader technique of inversion of control. A client who wants to call some services should not have to know how to construct those services.

Let's face it, maintaining large applications is not easy, especially if everything is [tangled together](<https://en.wikipedia.org/wiki/Coupling_(computer_programming)>) and [spread all over the place](<https://en.wikipedia.org/wiki/Cohesion_(computer_science)>). The recommendation when using Redux is to [only ever have a single store](https://redux.js.org/faq/store-setup#can-or-should-i-create-multiple-stores-can-i-import-my-store-directly-and-use-it-in-components-myself). Furthermore, `createStore` expects you to pass the root reducer statically, meaning that if your React application is sprawling with features and various modules, you'd have to import all the necessary reducers your application would ever need in some kind of `configureStore.js` file. This approach is not scalable.

It is very likely that the modules are already responsible for fetching their data and defining their [npm dependencies](https://classic.yarnpkg.com/blog/2017/08/02/introducing-workspaces/), what if they could be responsible for defining their Redux dependencies (such as reducers) as well? Redux Syringe makes this possible.

?> This tutorial assumes basic knowledge of the [Redux](https://redux.js.org/) library.

First, it is necessary to prepare your store for these shenanigans. We need to go from this:

```js
import { reducer as userManagement } from '@awesome-project/user-management';
import { reducer as authentication } from '@awesome-project/authentication';
import { createStore, combineReducers } from 'redux';

export const configureStore = () =>
	createStore(
		combineReducers({
			userManagement,
			authentication,
			// And like 20 more reducers...
		})
	);
```

To this:

```js
import { createStore, combineReducers } from 'redux';
import { makeReducersEnhancer } from 'redux-syringe';

export const configureStore = () => createStore(state => state, makeReducersEnhancer());
```

Usually, your modules will expose a single React component, serving as the entry point.

```js
import React from 'react';
import { Router, Route } from '@awesome-project/routing';
import { UserManagement } from '@awesome-project/user-management';
import { ArticleManagement } from '@awesome-project/article-management';

const App = () => (
	<Router>
		<Route component={UserManagement} path="/user-management" />
		<Route component={ArticleManagement} path="/article-management" />
	</Router>
);
```

This is fine. We don't have to do anything here. As explained earlier, it is the modules themselves that should be responsible for defining their dependencies! Let's take a look at one of them.

```js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUsers, fetchUsers } from '../redux';
import { UserGrid } from './UserGrid';

export const UserManagement = () => {
	const dispatch = useDispatch();
	const users = useSelector(selectUsers);

	useEffect(() => {
		dispatch(fetchUsers());
	}, []);

	return <UserGrid users={users} />;
};
```

Okay, now how do we use Redux Syringe to define the Redux dependencies of this module?

```js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withReducers } from 'redux-syringe';
import { selectUsers, fetchUsers } from '../redux';
import { UserGrid } from './UserGrid';

const PureUserManagement = () => {
	const dispatch = useDispatch();
	const users = useSelector(selectUsers);

	useEffect(() => {
		dispatch(fetchUsers());
	}, []);

	return <UserGrid users={users} />;
};

export const UserManagement = withReducers({ userManagement: reducer })(PureUserManagement);
```

Looks easy enough, right? When the user management module is mounted, its reducer will be injected as well. Furthermore, when this module is unmounted, the reducer gets ejected too!

Because we no longer reference all the reducers in the root of the application, [code splitting](https://reactjs.org/docs/code-splitting.html) is now possible. All your module-specific Redux code can thus be fetched alongside the React code, which is invaluable for ultra-large applications.

## Side Effect Libraries

Redux Syringe also supports injection of [redux-observable epics](https://redux-observable.js.org/) and [generic Redux middleware](https://redux.js.org/advanced/middleware). Use the `withEpics` and `withMiddleware` decorators in the same way as `withReducers`.

?> Support for [redux-saga](https://redux-saga.js.org/) is not planned, but contributions are welcome nonetheless.

```js
import { o } from 'ramda';

const enhance = compose(
	withReducers({ userManagement: reducer }),
	withEpics(userManagementEpic),
	withMiddleware([userManagementMiddleware, someOtherMiddleware])
);
```

The idiomatic approach for injecting multiple epics or middleware is the array syntax. If you only need to inject a single epic or middleware, pass the injectable as the first argument directly.

!> Although all injectors support the object syntax, avoid using it for epics and middleware unless you need to inject them multiple times. For example, passing the same epic under two different keys will result in the epic being injected twice, which is usually undesirable. The object syntax should thus be used only for injecting reducers.

Reducers can be injected using the array and function syntaxes too, intuitively composing with the other reducers. For example, `withReducers(hydrationReducer)` will result in `hydrationReducer` managing the entire Redux state, making it possible to e.g. rehydrate the entire store from preloaded state on the fly.
