
hasLocalStorage = window['localStorage']?
$ = jQuery
$.storage = 
  set : (key, data, ttl) ->
    if hasLocalStorage
      storage = {
        data : data
        ttl : ttl || 0 
        createTime : now()
      }

      localStorage.setItem key, JSON.stringify storage
    else
      if ttl
        $.cookies.setOptions {
          hoursToLive : ttl / 3600
        }
      $.cookies.set key, data
  get : (key) ->
    if hasLocalStorage
      storage = localStorage.getItem key
      if !storage
        return null
      storage = JSON.parse storage
      if isAvailable storage
        return storage.data
      localStorage.removeItem key
      return null
    else
      $.cookies.get key
  del : (key) ->
    if hasLocalStorage
      localStorage.removeItem key
    else
      $.cookies.del key

now = Date.now || () ->
  return new Date().getTime()

isAvailable = (storage) ->
  ttl = storage.ttl
  if !ttl
    return true
  if ttl * 1000 + storage.createTime >= now()
    return true
  return false

