# README!

This is a boilerplate for typescript packages. Find and replace "`somepackage`" with the name of your package.

✔️ Compiles your package into commonjs using the typescript compiler - `yarn build`

✔️ Bundles the package for browser usage using parcel - `yarn build:browser`

✔️ Test your package using jest (tests go under `src/**/__tests__/**`) - `yarn test:unit`

✔️ Has eslint and prettier setup - `yarn test:lint && yarn test:format`

✔️ Has a precommit hook for auto-fixing formatting and linting using lint-staged [supports partial commits](https://medium.com/hackernoon/announcing-lint-staged-with-support-for-partially-staged-files-abc24a40d3ff)

✔️ Can generate docs from the code using [typedoc](https://typedoc.org/) - `yarn docs`
