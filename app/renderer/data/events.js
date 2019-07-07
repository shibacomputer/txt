/*  This is a small system that enforces sequential patterns for moving between items.
 */
const chain = require('../utils/chains')
const ipcRenderer = window.require('electron').ipcRenderer

const _ = require('underscore')

export default function events (state, emitter) {

  emitter.on('DOMContentLoaded', () => {
    state.queue = {
      upcoming: [ ],
      current: null,
      cache: null,
      active: false
    }
  })

  emitter.on('event:queue', (name, obj, opts = {
    prependEvents: true,
    startQueue: true
  }) => {

    // Setup default options
    const queue = chain[name]

    // Starting with an object? Cache it.
    obj ? emitter.emit('event:cache', obj) : emitter.emit('event:cache:clear')

    // Where should events go?
    opts.prependEvents ? state.queue.upcoming.unshift(...queue) : state.queue.upcoming.push(...queue)

    // Are we starting the queue?
    opts.startQueue? state.queue.active = true : state.queue.active = false

    // Is queue active on?
    state.queue.active? emitter.emit('event:next') : emitter.emit('event:pause')
  })

  emitter.on('event:next', (obj, opts = {
    cacheCurrentObject: true,
    clearCacheWhenDone: false,
    pauseAfterThisEvent: false,
    abortAfterThisEvent: false
  }) => {
    let data = null,      // Data we want to send to the queue
        toMain = false    // Flag to determine whether to send via IPC

    // Start by testing the queue for the next item.
    if (state.queue.upcoming.length === 0) {

      // End the event queue if we have nothing
      emitter.emit('event:end')
      return

    // We have an event!
    } else {
      // Get the next event
      state.queue.current = state.queue.upcoming[0]
      state.queue.upcoming.shift()

      // Do we have a cache? Let's use it
      data = obj ? { ...obj, ...state.queue.cache } : state.queue.cache

      // Is this event destined for IPC?
      toMain = state.queue.current.name.indexOf('main:') !== -1 ? true : false

      // Fire the event
      toMain? emitter.emit('main:send', { data: data }) : emitter.emit(state.queue.current.name, { data: data })

      // Should we cache this item?
      if (opts.cacheCurrentObject) emitter.emit('event:cache', data)
      else if (opts.clearCacheWhenDone) emitter.emit('event:cache:clear')

      // Pause?
      opts.pauseAfterThisEvent ? state.queue.active = false : state.queue.active = true

      // Abort?
      opts.abortAfterThisEvent ? emitter.emit('event:end') : state.queue.active = true
    }
  })

  emitter.on('event:done', (obj) => { // Add to this if we need to add events
    if (obj) emitter.emit('event:cache', obj)
    state.queue.active ? emitter.emit('event:next') : emitter.emit('event:end')
  })

  emitter.on('event:check', () => {
    // Do we meet conditionals?
    _.isMatch(state.context, state.queue.current.modifier.args) ? emitter.emit('event:queue', chain[state.queue.current.modifier.name]) : emitter.emit('event:next')
  })

  emitter.on('event:cache', (data) => {

    // Add to the cache
    state.queue.cache = {...state.queue.cache, ...data}
  })

  emitter.on('event:cache:clear', () => {

    // Delete the cache
    state.queue.cache = null
  })

  emitter.on('event:end', () => {

    // End everything
    state.queue.current = null
    state.queue.cache = null
    state.queue.active = false
  })

  ipcRenderer.on('event:queue', (e, name, obj, opts) => {
    emitter.emit('event:queue', name, obj, opts)
  })

  emitter.on('main:send', (data) => {
    eventName = state.queue.current.name.split('main:')
    ipcRenderer.send(eventName[1], {
      event: state.queue.current,
      data: data
    })

    ipcRenderer.once(state.queue.current.name, (e, response) => {
      // Do I need new events?
      if (response.target) emitter.emit('event:queue', response.target, response.data? response.data : null, response.obj? response.obj : null)

      // Do I have data I can work with?
      else if (response.data) emitter.emit('event:cache', response.data)

      // Is there an active queue?
      if (state.queue.active) emitter.emit('event:next')

      else emitter.emit('event:end')
    })
  })

  ipcRenderer.on('event:window:close', (e) => { window.close() })
}
