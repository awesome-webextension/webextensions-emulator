import {
  msgPageListeners,
  msgBgListeners,
  runtimeSendMessage
} from '../../helpers'

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

export const runtime = new Proxy(window.parent.browser.runtime, {
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
