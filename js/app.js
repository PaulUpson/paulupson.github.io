Vidpub = {};

Vidpub.start = function() {
   Vidpub.Auth0 = new Auth0({
    domain: AUTH0_DOMAIN,
    clientID: AUTH0_CLIENT_ID,
    callbackOnLocationHash: true,
    callbackURL: AUTH0_CALLBACK_URL,
  });
  Vidpub.parseHash();

  Vidpub.currentUser(Vidpub.personalize);
};

Vidpub.signUp = function(creds, next){
  Vidpub.Auth0.signup({
    connection: 'Username-Password-Authentication',
    responseType: 'token',
    email: creds.email,
    password: creds.password,
  }, next);
};

Vidpub.login = function(creds, next) {
  Vidpub.Auth0.login({
    connection: 'Username-Password-Authentication',
    responseType: 'token',
    email: creds.email,
    password: creds.password,
    //scope: 'openid profile'
  }, next);
};

Vidpub.github = function(next){
  Vidpub.Auth0.login({
    connection: 'github',
  }, next);
}

Vidpub.parseHash = function() {
    var token = localStorage.getItem('id_token');
    if (!token) {
      var result = Vidpub.Auth0.parseHash(window.location.hash);
      if (result && result.idToken) {
        localStorage.setItem('id_token', result.idToken);        
      } else if (result && result.error) {
        alert('error: ' + result.error);
        location.href = "/account/login";        
      }      
    }   
};

Vidpub.currentUser = function(next){
  var idToken = localStorage.getItem('id_token');
  if (idToken) {
    Vidpub.Auth0.getProfile(idToken, function(err, profile){
      if (profile){
        next(profile);
      }
    });
  } else {
    next(null);
  }
};

Vidpub.personalize = function(user){
  var ViewModel = {
    isLoggedIn: user ? true : false,
    name: ko.computed(function(){
      if (user){
        return user.name;
      } else {
        return '';
      }
    }),
    login_or_out: function(){
      if (user){
        localStorage.removeItem('id_token');
        location.href = "/";
      } else {
        location.href = "/account/login";
      }
    },
    login_or_out_button: ko.computed(function(){
      if (user){
        return "Logout";
      } else {
        return "Login";
      }
    })    
  }
  ko.applyBindings(ViewModel);
};