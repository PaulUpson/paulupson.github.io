Vidpub = {};

Vidpub.start = function() {
   // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDnlZgxzmGt7Mbd3YHaeZKqHzOcDitsUXA",
    authDomain: "vidpub-4bd95.firebaseapp.com",
    databaseURL: "https://vidpub-4bd95.firebaseio.com",
    storageBucket: "vidpub-4bd95.appspot.com",
    messagingSenderId: "27677043239"
  };
  Vidpub.firebase = firebase.initializeApp(config);

  Vidpub.firebase.auth().onAuthStateChanged(function(user){
    loadCurrentUser(user, personalize);
  });  
};

var loadCurrentUser = function(user, next){  
  if (user){
    Vidpub.firebase.database().ref('users/' + user.uid).once('value').then(function(user){
      next(user.val());
    });
  } else {
    next(null);
  }
};

Vidpub.saveUser = function(id, userData, next) {
  Vidpub.firebase.database().ref('users/' + id).set(userData).then(next);
};

Vidpub.createUser = function(creds, next, fail){
  Vidpub.firebase.auth().createUserWithEmailAndPassword(creds.email, creds.password).then(function(userData){
    var user = {
      name: userData.displayName,
      email: userData.email
    };

    Vidpub.saveUser(userData.uid, user, next);
  }, fail);
};

Vidpub.login = function(creds, next) {
  Vidpub.firebase.auth().signInWithEmailAndPassword(creds.email, creds.password)
    .then(next, next)
    .catch(function(error) {
    // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode === 'auth/wrong-password') {
        alert('Wrong password.');
      } else {
        alert(errorMessage);
      }
      console.log(error);
  });
}

Vidpub.loginGithub = function(next){
  var provider = new firebase.auth.GithubAuthProvider();
  Vidpub.firebase.auth().signInWithPopup(provider).then(function(result){
    if (result.credential) {
      // This gives you a GitHub Access Token.
      var token = result.credential.accessToken;
    }
    var user = result.user;
    var userData = {
      name: user.displayName,
      email: user.email,
      githubber: true
    };

    Vidpub.saveUser(user.uid, userData, next);    
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    if (errorCode === 'auth/account-exists-with-different-credential') {
      alert('You have signed up with a different provider for that email.');
      // Handle linking here if your app allows it.
    } else {
      console.error(error);
    }
  });

  // provider.addScope('repo');
  // provider.setCustomParameters({ 'allow_signup': 'false'});
  // Vidpub.firebase.auth().signInWithRedirect(provider);
}

var personalize = function(user){
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
        Vidpub.firebase.auth().signOut().then(function(){
          location.href = "/";
        });        
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