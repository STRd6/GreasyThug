(function() {
  var __slice = Array.prototype.slice;

  window.namespace = function(target, name, block) {
    var item, top, _i, _len, _ref, _ref2;
    if (arguments.length < 3) {
      _ref = [(typeof exports !== 'undefined' ? exports : window)].concat(__slice.call(arguments)), target = _ref[0], name = _ref[1], block = _ref[2];
    }
    top = target;
    _ref2 = name.split('.');
    for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
      item = _ref2[_i];
      target = target[item] || (target[item] = {});
    }
    return block(target, top);
  };

}).call(this);
(function() {

  namespace("Thug.Persistence", function(Persistence) {
    /**
    A wrapper on the Local Storage API 
    
    @name Local
    @namespace
    */
    /**
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
    */
    var retrieve, store;
    store = function(key, value) {
      localStorage[key] = JSON.stringify(value);
      return value;
    };
    /**
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
    */
    retrieve = function(key) {
      var value;
      value = localStorage[key];
      if (value != null) return JSON.parse(value);
    };
    return Persistence.Local = {
      get: retrieve,
      set: store,
      put: store,
      /**
      Access an instance of Local with a specified prefix.
      
      @name new
      @methodOf Local
      
      @param {String} prefix 
      @returns {Local} An interface to local storage with the given prefix applied.
      */
      "new": function(prefix) {
        prefix || (prefix = "");
        return {
          get: function(key) {
            return retrieve("" + prefix + "_" + key);
          },
          set: function(key, value) {
            return store("" + prefix + "_" + key, value);
          },
          put: function(key, value) {
            return store("" + prefix + "_" + key, value);
          }
        };
      }
    };
  });

}).call(this);
(function() {

  namespace("Thug", function(Thug) {
    return Thug.History = function(I, self) {
      var commands, data, index;
      if (I == null) I = {};
      if (self == null) self = {};
      Object.reverseMerge(I, {
        maxHistory: 50
      });
      if (I.localPersistenceKey) {
        if (data = Thug.Persistence.Local.get(I.localPersistenceKey)) {
          if (data.maxHistory) I.maxHistory = data.maxHistory;
          commands = data.commands;
        }
      }
      commands || (commands = []);
      index = commands.length;
      Object.extend(self, {
        push: function(command) {
          if (command !== commands.last()) commands.push(command);
          if (commands.length > I.maxHistory) commands.shift();
          Thug.Persistence.Local.set(I.localPersistenceKey, self);
          return index = commands.length;
        },
        previous: function() {
          index = Math.max(index - 1, -1);
          return commands[index];
        },
        next: function() {
          index = Math.min(index + 1, commands.length);
          return commands[index];
        },
        toJSON: function() {
          return {
            commands: commands,
            maxHistory: I.maxHistory
          };
        }
      });
      return self;
    };
  });

}).call(this);
