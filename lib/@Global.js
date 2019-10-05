var Global = (function() {
  // priveid function
  var state = {};
  function _set(n, v) {
    state[n] = v;
  }
  function _get(n) {
    return state[n];
  }

  return {
    set: _set,
    get: _get
  };
})();
