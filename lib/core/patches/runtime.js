import _ from 'lodash'
import {
  msgPageListeners,
  msgBgListeners,
  runtimeSendMessage
} from '../../helpers'

window[msgPageListeners] = window[msgPageListeners] || []
window[msgBgListeners] = window[msgBgListeners] || []

window.browser.runtime.id = `Extension_ID_${Date.now()}`
window.browser.runtime.getURL.callsFake(path => path)
window.browser.runtime.getPlatformInfo.callsFake(() => Promise.resolve({}))
window.browser.runtime.getManifest.callsFake(() => Promise.resolve({}))
window.browser.runtime.reload.callsFake(() => window.location.reload(true))

window.browser.runtime.onStartup._listeners.forEach(listener => {
  if (!_.isFunction(listener)) {
    throw new TypeError('Wrong argument type')
  }
  setTimeout(listener, 0)
})

window.browser.runtime.onInstalled._listeners.forEach(listener => {
  if (!_.isFunction(listener)) {
    throw new TypeError('Wrong argument type')
  }
  // delay startup calls
  listener({ reason: 'install' })
})

window.browser.runtime.onMessage.addListener = listener => {
  if (!_.isFunction(listener)) {
    throw new TypeError('Wrong argument type')
  }
  if (!window[msgPageListeners].some(x => x === listener)) {
    window[msgPageListeners].push(listener)
  }
}
window.browser.runtime.onMessage.removeListener = listener => {
  if (!_.isFunction(listener)) {
    throw new TypeError('Wrong argument type')
  }
  window[msgPageListeners] = window[msgPageListeners].filter(
    x => x !== listener
  )
}
window.browser.runtime.onMessage.hasListener = listener => {
  if (!_.isFunction(listener)) {
    throw new TypeError('Wrong argument type')
  }
  return window[msgPageListeners].some(x => x === listener)
}

window.browser.runtime.sendMessage.callsFake(
  runtimeSendMessage(window[msgBgListeners])
)
