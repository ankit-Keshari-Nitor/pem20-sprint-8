/**
   PRIVATE LICENSE
   */
  
'use strict';

var button = require('./button.js');
var textInput = require('./text-input.js');
var textarea = require('./textarea.js');
var datepicker = require('./datepicker.js');
var checkbox = require('./checkbox.js');
var radio = require('./radio.js');
var select = require('./select.js');
var number = require('./number.js');
var password = require('./password.js');
var fileUpload = require('./file-upload.js');
var accordion = require('./accordion.js');
var link = require('./link.js');

const formFields = [button.default, textInput.default, textarea.default, datepicker.default, checkbox.default, radio.default, select.default, number.default, password.default, fileUpload.default, accordion.default, link.default];

exports.formFields = formFields;
