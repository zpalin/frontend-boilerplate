// import { Person } from './model/person';
var Person = require('./model/person')
window.$ = require('jquery');

window.app = {
  init () {
    var christoph = new Person('Christoph', 'Burgdorf');
    console.log(christoph.fullName);
  }
}

$(document).ready( () => {
  console.log("hello world");

  app.init()
})