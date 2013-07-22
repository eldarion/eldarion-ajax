cat js/polyfills.js js/eldarion-ajax-core.js js/eldarion-ajax-handlers.js | uglifyjs -ncm > js/.tmp.min.js
cat js/copyright.js js/.tmp.min.js > js/eldarion-ajax.min.js
rm js/.tmp.min.js