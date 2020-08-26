exports.parse = function(buffer) {
  var rpIdHash = buffer.slice(0, 32);
  var flags = buffer.slice(32, 33);
  var signCount = buffer.slice(33, 37);
  
  // TODO: attested credential data
  // TODO: extensions
  
  return {
    rpIdHash: rpIdHash,
    flags: flags[0],
    signCount: signCount.readUInt32BE(0)
  };
};

// TODO: exports.format
