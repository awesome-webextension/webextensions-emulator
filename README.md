# WebExtensions Emulator

Functional fake WebExtensions environment for development.

## Why?

Developing Chrome Extensions or WebExtensions could be daunting:

1. Live reloading is tricky, let alone hot module replacement.
2. Framework dev-tools are unable to work because of the cross-extension policy.

## How?

We could just run source code in a normal webpage with a fake `window.browser` global variable. This can be done via [sinon-chrome](https://github.com/acvetkov/sinon-chrome) which stubs all the schema generated apis.

Simply stubing is not enough though, this project patches some of the apis to make it function properly.

Communications between the developing page and background page needs a bit more work. This project offers a workaround by running the background patch with the background source code in a iframe.

## Usage

Use `core.js` and `background.js` module in `dist`. You can also use `src/core/index.js` and `src/background/index.js` directly with webpack.

Depending on your build system, load `core` before everything else, then load `background` with your background source code in a iframe, then load everything left.

If using webpack-dev-server, make sure `inline` is disabled to make it work with iframe.

You can also add your own patch before loading your source code. PRs are welcome if you find any bug or incompletion.
