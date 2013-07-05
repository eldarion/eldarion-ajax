cat js/bootstrap-ajax-core.js js/bootstrap-ajax-handlers.js | uglifyjs -ncm > js/.tmp.min.js
cat js/copyright.js js/.tmp.min.js > js/bootstrap-ajax.min.js
rm js/.tmp.min.js