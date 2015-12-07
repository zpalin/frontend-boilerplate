var app = require('ampersand-app')
var Person = require('./models/person')

window.app = app.extend({
  init () {
    var christoph = new Person('Christoph', 'Burgdorf');
    console.log(christoph.fullName);
    console.log("hello world!");
    // this.me = new Me()
    // this.me.fetchInitialData()
    // this.router = new Router()
    // this.router.history.start()
  }
})

app.init()