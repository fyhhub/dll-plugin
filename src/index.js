const isarray = require('isarray')
const ispromise = require('is-promise')
console.log(isarray([]));
console.log(ispromise(Promise.resolve()));