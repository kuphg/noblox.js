// Dependencies
var request = require('request');

// Includes
var login = require('./util/login.js'),
  getSession = require('./util/getSession.js'),
  getCurrentUser = require('./util/getCurrentUser.js'),
  setRank = require('./setRank.js'),
  getRoles = require('./util/getRoles.js'),
  getToken = require('./util/getToken.js'),
  message = require('./message.js');

// Vars
var _jar = request.jar(); // Default cookie jar

// Define
function makeCallbackArray(options,success,failure,always) {
  return {success: options.success || success, failure: options.failure || failure, always: options.always || options.callback || always};
}

exports.login = function(options,password,jar,success,failure,always) {
  var callbacks = makeCallbackArray(options,success,failure,always);
  if (typeof options == 'object') {
    var j = options.jar;
    return login((j ? j : _jar),options.username,options.password,callbacks);
  } else if (typeof options == 'string')
    return login((jar ? jar : _jar),options,password,callbacks);
};

exports.getSession = function(options) {
  if (options && options.hasOwnProperty('jar'))
    return getSession(options.jar);
  else
    return getSession(options || _jar);
};

exports.getCurrentUser = function(options,jar,success,failure,always) {
  var callbacks = makeCallbackArray(options,success,failure,always);
  if (typeof options == 'object') {
    var j = options.jar;
    return getCurrentUser((j ? j : _jar), options.option, callbacks);
  } else
    return getCurrentUser((jar ? jar : _jar), options, callbacks);
};

exports.getRoles = function(options,rank,success,failure,always) {
  var callbacks = makeCallbackArray(options,success,failure,always);
  if (typeof options == 'object')
    return getRoles(options.group, options.rank, callbacks);
  else
    return getRoles(options, rank, callbacks);
};

exports.getToken = function(options,jar,callback,failure) {
  var callbacks = {failure: options.failure || failure};
  if (typeof options == 'object') {
    var j = options.jar;
    return getToken((j ? j : _jar), options.url, callback, callbacks);
  } else
    return getToken((jar ? jar : _jar), options, callback, callbacks);
};

function setRankMain(options,target,roleset,token,jar,success,failure,always) {
  var callbacks = makeCallbackArray(options,success,failure,always);
  if (typeof options == 'object') {
    var j = options.jar;
    return setRank((j ? j : _jar), options.group, options.target, options.roleset, options.token, callbacks);
  } else
    return setRank((jar ? jar : _jar), options, target, roleset, token, callbacks);
}

exports.setRank = function(options) {
  if (options.rank) {
    getRoles(options.group,options.rank,function(role) {
      options.roleset = role;
      setRankMain(options);
    },options.failure,options.always);
  } else
    setRankMain.apply(undefined, arguments);
};

exports.message = function(options,subject,body,token,jar,success,failure,always) {
  var callbacks = makeCallbackArray(options,success,failure,always);
  if (typeof options == 'object') {
    var j = options.jar;
    return message((j ? j : _jar), options.recipient, options.subject, options.body, options.token, callbacks);
  } else
    return message((jar ? jar : _jar), options, subject, body, token, callbacks);
};

// Export
exports.getJar = function() {
    return _jar;
};