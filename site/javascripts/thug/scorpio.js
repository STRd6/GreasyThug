/**
 *  Scorpio handles all the database connectivity.
 */
var Scorpio = function() {
  var logging = true;
  var db;

  var createTables = function(db) {
    db.execute('CREATE TABLE IF NOT EXISTS config (key VARCHAR(16) PRIMARY KEY, value VARCHAR(16))');
    db.execute('CREATE TABLE IF NOT EXISTS history (id INTEGER PRIMARY KEY, code TEXT)');
    db.execute('CREATE TABLE IF NOT EXISTS scripts (id INTEGER PRIMARY KEY, title VARCHAR(255), code TEXT, active BOOLEAN DEFAULT 0)');
  }
  
  var dropTables = function(db) {
    db.execute('DROP TABLE IF EXISTS config');
    db.execute('DROP TABLE IF EXISTS history');
    db.execute('DROP TABLE IF EXISTS scripts');
  }
  
  /**
   *  Converts the result rows to an array of objects.
   */
  function rowsToObjects(rows) {
    var results = [];
    var i = 0;
    var length = rows.length;
    
    while(i < length) {
      results.push(rows.item(i));
      i++;
    }
    
    return results;
  }
  
  function TableInterface(table, options) {
    options = options || {};
    var primaryKey = options.primaryKey || 'id';
  
    return {
      all: function(callback) {
        db.execute('SELECT * FROM ' + table, [], function(transaction, result) {
          callback(rowsToObjects(result.rows));
        });
      },
      
      count: function(callback) {
        db.execute('SELECT COUNT(*) AS count FROM ' + table, [], function(transaction, result) {
          callback(result.rows.item(0).count);
        });
      },
      
      create: function(object) {
        var fields = [];
        var values = [];
        var placeholders = [];
        
        $.each(object, function(key, value) {
          fields.push(key);
          values.push(value);
          placeholders.push('?');
        });
        
        db.execute(
          'INSERT INTO ' + table + 
          ' (' + fields.join(', ') + ') ' +
          'VALUES(' + placeholders.join(', ') + ')',
          values
        );
      },
      
      destroy: function(id) {
        db.execute('DELETE FROM ' + table + ' WHERE ' + primaryKey + ' = ?', [id]);
      },
      
      destroyAll: function() {
        db.execute('DELETE FROM ' + table);
      },
      
      find: function(id, callback) {
        var rs = db.execute(
          'SELECT * FROM ' + table + 
          ' WHERE ' + primaryKey + ' = ?', [id],
          function(transaction, result) {
            callback(result.rows.item(0));
          }
        );
      },
      
      update: function(id, object) {
        var fields = [];
        var values = [];
        
        $.each(object, function(key, value) {
          fields.push(key + " = ?");
          values.push(value);
        });
        
        values.push(id);
        
        db.execute(
          'UPDATE ' + table + 
          ' SET ' + fields.join(', ') + 
          ' WHERE ' + primaryKey + ' = ?',
          values
        );
      }
    }
  };

  var self = {
    init: function() {
      //db = google.gears.factory.create('beta.database', '1.0');
      //db.open('scorpio');
      
      db = openDatabase("greasy_thug", "0.0", "Greasy Thug Database",  250 * 1024);
      db.execute = function(query, params, success, error) {
        if(logging) {
          console.log(query);
          console.log(params);
        }
        
        this.transaction(function(transaction) {
          transaction.executeSql(query, params, success, error);
        });
      }
      
      createTables(db);
      
      self.db = db;
    },
    
    executeSql: function(sql, params, callback) {
      db.execute(sql, params, function(transaction, result) {
        callback(rowsToObjects(result.rows));
      });
    },
    
    reset: function() {
      if(!db) {
        self.init();
      }
      
      dropTables(db);
      createTables(db);
    },
    
    loadConfig: function(callback) {
      db.execute('SELECT key, value FROM config', [], function(transaction, result) {
        var config = {};
        var rs = result.rows;
        
        var i = 0;
        var rowCount = rs.length;
        var item;
        while(i < rowCount) {
          item = rs.item(i);
          config[item.key] = item.value;
          i++;
        }
        
        callback(config);
      });
    },
    
    storeConfig: function(config) {
      for(var key in config) {
        var value = config[key];
        db.execute('INSERT OR REPLACE INTO config (key, value) VALUES(?, ?)', [key, value]);
      }
    },
    
    loadHistory: function(callback) {
      db.execute('SELECT code FROM history ORDER BY id ASC', [], function(transaction, result) {
        var codes = $.map(rowsToObjects(result.rows), function(row) {
          return row.code;
        });

        callback(codes);
      });
    },
    
    storeHistory: function(code) {
      db.execute('INSERT INTO history (code) VALUES(?)', [code]);
    },
    
    deleteScript: function(id) {
      db.execute('DELETE FROM scripts WHERE id = ?', [id]);
    },
    
    scripts: new TableInterface('scripts')
  };
  
  return self;
}();
