namespace "Pixie.Persistence", (Persistence) ->
  ###*
  A wrapper on the Local Storage API 

  @name Local
  @namespace
  ###

  ###*
  Store an object in local storage.

  <code><pre>
  # you can store strings
  Local.set('name', 'Matt')

  # and numbers
  Local.set('age', 26)

  # and even objects
  Local.set('person', {name: 'Matt', age: 26})
  </pre></code>

  @name set
  @methodOf Local

  @param {String} key string used to identify the object you are storing
  @param {Object} value value of the object you are storing

  @returns {Object} value
  ###
  store = (key, value) ->
    localStorage[key] = JSON.stringify(value)

    return value

  ###*
  Retrieve an object from local storage.

  <code><pre>
  Local.get('name')
  # => 'Matt'

  Local.get('age')
  # => 26

  Local.get('person')
  # => { age: 26, name: 'Matt' }
  </pre></code>

  @name get
  @methodOf Local

  @param {String} key string that identifies the stored object

  @returns {Object} The object that was stored or undefined if no object was stored.
  ###
  retrieve = (key) ->
    value = localStorage[key]

    if value?
      JSON.parse(value)

  # Export
  Persistence.Local =
    get: retrieve
    set: store
    put: store

    ###*
    Access an instance of Local with a specified prefix.

    @name new
    @methodOf Local

    @param {String} prefix 
    @returns {Local} An interface to local storage with the given prefix applied.
    ###
    new: (prefix) ->
      prefix ||= ""

      get: (key) ->
        retrieve("#{prefix}_#{key}")
      set: (key, value) ->
        store("#{prefix}_#{key}", value)
      put: (key, value) ->
        store("#{prefix}_#{key}", value)
