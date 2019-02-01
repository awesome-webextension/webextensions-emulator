window.browser.menus.create.callsFake(() => Promise.resolve())
window.browser.menus.remove.callsFake(() => Promise.resolve())
window.browser.menus.removeAll.callsFake(() => Promise.resolve())

window.browser.contextMenus.create = window.browser.menus.create
window.browser.contextMenus.remove = window.browser.menus.remove
window.browser.contextMenus.removeAll = window.browser.menus.removeAll
