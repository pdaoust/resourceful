var resourceful = require('../resourceful');

resourceful.cache = true;
resourceful.caches = {
  stores: [],
  push: function (store) {
    return this.stores.push(store);
  },
  clear: function () {
    this.stores.forEach(function (s) { s.clear() });
    return this;
  }
};

this.Cache = function (options) {
  this.size = 0;
  this.store = {};

  resourceful.caches.push(this);
};

this.Cache.prototype = {
  get: function (id) {
    var that = this;
    if (!resourceful.cache) { return }
    if (!id) { return }
    else if (Array.isArray(id)) {
      return id.map(function (k) {
        return that.store[k.toString()];
      });
    } else {
      return this.store[id.toString()];
    }
  },
  put: function (id, obj) {
    if (!resourceful.cache) { return }
    if (!this.has(id)) { this.size ++ }
    this.store[id] = obj;
  },
  update: function (id, obj) {
    if (!resourceful.cache) { return }
    if (id in this.store) {
      for (var k in obj) {
        try { this.store[id][k] = obj[k]; }
        catch (ex) { }
      }
    }
  },
  clear: function (id) {
    if (!resourceful.cache) { return }
    if (id) {
      this.size --;
      delete(this.store[id]);
    } else {
      this.size = 0;
      this.store = {};
    }
  },
  has: function (id) {
    if (!resourceful.cache) { return }
    return id in this.store;
  }
};