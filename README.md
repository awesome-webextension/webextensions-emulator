# WebExtensions Emulator

Functional fake WebExtensions environment for development.

## Why?

Developing Chrome Extensions or WebExtensions could be daunting:

1. Live reloading is tricky, let alone hot module replacement.
2. Framework dev-tools are unable to work because of the cross-extension policy.

## How?

We could just run source code in a normal webpage with a fake `window.browser` global variable. This can be done via [sinon-chrome](https://github.com/acvetkov/sinon-chrome) which stubs all the schema generated apis.

Simply stubing is not enough though, this project patches some of apis to make it actually functional.

Communications between a extension-owned UI page and the background page needs a bit more work. This project offers a workaround by running the background patch with the background source code in a iframe.

## Usage

You can use `core` and `background` module in `src` or `dist`. Depending on your build system, load `core` before everything else, then load `background` with your background source code in a iframe, then load everything left.

If using webpack-dev-server, make sure `inline` is disabled for running webpack-dev-server inject code in iframe.
