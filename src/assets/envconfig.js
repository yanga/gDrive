(function(window) {
  window["envconfig"] = window["envconfig"] || {};

  // Environment variables
  window["envconfig"]["apiurl"] = "http://localhost:3000/api";
  console.log('ENV:::', window["envconfig"]);
})(this);
