'use strict';

var LoadReactPivot = require('../load');

var root = window || undefined;

if (typeof define === 'function' && define.amd) {
  // AMD
  define(['ReactPivot'], LoadReactPivot);
} else {
  // Global Variables
  root.ReactPivot = LoadReactPivot;
}