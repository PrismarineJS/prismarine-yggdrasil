'use strict';

var yggdrasil = require('./');

var username = process.env.MC_USERNAME;
var password = process.env.MC_PASSWORD;
var serverId = process.env.MC_SERVERID;

if (!username || !password) {
  console.log('usage: MC_USERNAME=username@example.com MC_PASSWORD=secret MC_SERVERID=123 '+process.argv.join(' '));
  process.exit(-1);
}

var clientToken = yggdrasil.generateUUID();
var refresh = false;

yggdrasil.getSession(username, password, clientToken, refresh, function(err, session) {
  if (err) {
    console.log('getSession failed:', err);
    return;
  }

  console.log('Logged in with session:', session);

  var accessToken = session.accessToken;
  var selectedProfile = session.selectedProfile;

  yggdrasil.joinServer(username, serverId, accessToken, selectedProfile, function(err) {
    if (err) {
      console.log('joinServer failed:', err);
      return;
    } else {
      console.log('Joined server:', serverId);
    }

    yggdrasil.validateSession(session.username, serverId, function(err, validatedId) {
      if (err) {
        console.log('validateSession failed: ',err);
        return;
      }

      console.log('Validated session: ', validatedId);
    });
  });
});
