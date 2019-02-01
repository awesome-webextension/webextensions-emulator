import {
  msgPageListeners,
  msgBgListeners,
  runtimeSendMessage
} from '../helpers'

const tabs = new Proxy(window.parent.browser.tabs, {
  get: (...args) => {
    if (args[1] === 'sendMessage') {
      // Assuming all tab messages are sent to the tab that is under development
      // Filter out messages if you need to narrow down
      return function sendMessage (tabId, message) {
        if (typeof tabId !== 'string') {
          return Promise.reject(new TypeError('Wrong argument type'))
        }
        return sendMessage(message)
      }
    }
    return Reflect.get(...args)
  }
})

const sendMessage = runtimeSendMessage(window.parent[msgPageListeners])

const onMessage = new Proxy(window.parent.browser.runtime.onMessage, {
  get: (...args) => {
    switch (args[1]) {
      case 'addListener':
        return function addListener (listener) {
          if (typeof listener !== 'function') {
            throw new TypeError('Wrong argument type')
          }
          if (!window.parent[msgBgListeners].some(x => x === listener)) {
            window.parent[msgBgListeners].push(listener)
          }
        }
      case 'removeListener':
        return function removeListener (listener) {
          if (typeof listener !== 'function') {
            throw new TypeError('Wrong argument type')
          }
          window.parent[msgBgListeners] = window.parent[msgBgListeners].filter(
            x => x !== listener
          )
        }
      case 'hasListener':
        return function hasListener (listener) {
          if (typeof listener !== 'function') {
            throw new TypeError('Wrong argument type')
          }
          return window.parent[msgBgListeners].some(x => x === listener)
        }
    }
    return Reflect.get(...args)
  }
})

const runtime = new Proxy(window.parent.browser.runtime, {
  get: (...args) => {
    switch (args[1]) {
      case 'sendMessage':
        return sendMessage
      case 'onMessage':
        return onMessage
    }
    return Reflect.get(...args)
  }
})

window.browser = new Proxy(window.parent.browser, {
  get: (...args) => {
    switch (args[1]) {
      case 'tabs':
        return tabs
      case 'runtime':
        return runtime
    }
    return Reflect.get(...args)
  }
})
