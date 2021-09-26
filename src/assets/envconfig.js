(function(window) {
  window["envconfig"] = window["envconfig"] || {};

  // Environment variables
  window["envconfig"]["apiurl"] = "http://localhost:8080/api";
  console.log('ENV:::', window["envconfig"]);
})(this);
