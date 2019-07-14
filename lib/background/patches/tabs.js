export const tabs = new Proxy(window.parent.browser.tabs, {
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
