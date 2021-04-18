<h1 align="center">
Redux Syringe
</h1>

<h3 align="center">
🛠 💪 💉
</h3>

<h3 align="center">
Maintaining large Redux applications with ease.
</h3>

<p align="center">
A collection of tools for maintaining large Redux applications by enabling dependency injection of Redux code and development of multi-instance components by namespacing their state.
</p>

<p align="center">
  <a href="https://github.com/wafflepie/redux-syringe/blob/main/LICENSE">
    <img src="https://flat.badgen.net/badge/license/MIT/blue" alt="MIT License" />
  </a>

  <a href="https://npmjs.com/package/redux-syringe">
    <img src="https://flat.badgen.net/npm/dm/redux-syringe" alt="Downloads" />
  </a>

  <a href="https://npmjs.com/package/redux-syringe">
    <img src="https://flat.badgen.net/npm/v/redux-syringe" alt="Version" />
  </a>
</p>

Redux Syringe consists mainly of:

- [Store enhancers](https://github.com/reduxjs/redux/blob/master/docs/understanding/thinking-in-redux/Glossary.md#store-enhancer) for injecting reducers, middleware, and epics into your Redux store after the store is created.
- Logic for managing your state via namespaces.

Although the Redux Syringe core is platform-agnostic, [React](https://github.com/facebook/react/) bindings are included for tying the injection mechanism to the lifecycle of your components.

## Documentation & API Reference

See [wafflepie.github.io/redux-syringe](https://wafflepie.github.io/redux-syringe/), powered by Docsify.

## Installation

The `redux-syringe` package contains everything you'll need to get started with using Redux Syringe in a React application. Use either of these commands, depending on the package manager you prefer:

```sh
yarn add redux-syringe

npm i redux-syringe
```

Please visit [wafflepie.github.io/redux-syringe](https://wafflepie.github.io/redux-syringe/) to see all available packages.

## Changelog

See the [CHANGELOG.md](https://github.com/wafflepie/redux-syringe/blob/main/CHANGELOG.md) file.

## Contributing

We are open to all ideas and suggestions, feel free to open an issue or a pull request!

## License

All packages are distributed under the MIT license. See the license [here](https://github.com/wafflepie/redux-syringe/blob/main/LICENSE).