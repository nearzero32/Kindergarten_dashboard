// firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/8.2.7/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/8.2.7/firebase-messaging.js')

const firebaseConfig = {
  apiKey: 'AIzaSyCoJuuUmbICAqNQC2PC3fmax-Ze8nIxz5Y',
  authDomain: 'qalam-c7130.firebaseapp.com',
  projectId: 'qalam-c7130',
  storageBucket: 'qalam-c7130.appspot.com',
  messagingSenderId: '482075507143',
  appId: '1:482075507143:web:cb68a99b052f37d97501e2',
  measurementId: 'G-09TNFVRSX7',
}

const app = firebase.initializeApp(firebaseConfig)

app
  .messaging()
  .getToken({ vapidKey: 'BA8P1VOhzKrUVz4kMmGx_AkBzSlY-UKH2o3NPkhQAsh3XlVWcz-XKUpzRIXFYLwiA8nsqXtjR1A19x3NTk__6vc' })
  .then(currentToken => {
    if (currentToken) {
      console.log('client token', currentToken)
    } else {
      console.log('No registration token available. Request permission to generate one.')
    }
  })
  .catch(err => {
    console.log('An error occurred while retrieving token. ', err)
  })
