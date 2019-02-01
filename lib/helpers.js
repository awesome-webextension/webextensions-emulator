import _ from 'lodash'

export const msgPageListeners = Symbol.for('fake_env_msgPageListeners')
export const msgBgListeners = Symbol.for('fake_env_msgBackgroundListeners')

export function runtimeSendMessage (listenersArea) {
  return function sendMessage (extensionId, message) {
    return new Promise((resolve, reject) => {
      if (typeof extensionId !== 'string') {
        message = extensionId
      }
      try {
        message = JSON.parse(JSON.stringify(message))
      } catch (err) {
        return reject(new TypeError('Wrong argument type'))
      }

      let isClosed = false
      let isAsync = false
      function sendResponse (response) {
        if (isClosed) {
          return reject(new Error('Attempt to response a closed channel'))
        }
        try {
          // deep clone & check data
          response = JSON.parse(JSON.stringify(response))
        } catch (err) {
          return reject(new TypeError('Response data not serializable'))
        }
        resolve(response)
      }

      listenersArea.forEach(listener => {
        const hint = listener(message, {}, sendResponse)
        // return true or Promise to send a response asynchronously
        if (hint === true) {
          isAsync = true
        } else if (hint && _.isFunction(hint.then)) {
          // promise style
          isAsync = true
          hint.then(sendResponse)
        }
      })

      // close synchronous response
      setTimeout(() => {
        if (!isAsync) {
          isClosed = true
        }
      }, 0)
    })
  }
}
