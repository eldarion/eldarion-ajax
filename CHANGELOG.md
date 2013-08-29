# ChangeLog

## 0.12.0

* Added a triggerHandler for easy manipulation of data prior to sending to server

## 0.11.0

* Added support for sending data with a.click

## 0.10.0

* Closed #38 by adding support for setting up interval and timeout timers

## 0.9.2

* Renamed components.json to bower.json
* Factored AJAX request logic into a shared function between form.submit and a.click

## 0.9.1

* Provide data defaults in case the server didn't return response data. This allows for a more consistent method for writing handlers.

## 0.9.0

This was a very minor release. Should have likely been a 0.7.3, except that I wanted to start versioning eldarion-ajax-core.js and eldarion-ajax-handlers.js separately and maintain a combined eldarion-ajax.min.js version on top of that, which I reasoned should warrant a point release, however, I made the mistake of going to 0.9.0 instead of just 0.8.0.

* Did a bunch of non-functional internal improvements
  * Added test suite with tests running across latest 4 versions of jQuery
  * Fixed issues identified by linting
  * Updated internal style
  * Added some documentation
  * Hooked up Travis CI integration
* Fixed bug in the fragments handlers 

## 0.8.0

Skipped this version by mistake

## 0.7.2

* Closed #36 by sending X-Eldarion-Ajax header with each AJAX request

## 0.7.1

* Closed #25 by triggering event for status code 400

## 0.7.0

* renamed library to eldarion-ajax
* broke apart core and handlers
* got rid of FormData to be more widely compatible
* removed the form input clearing
* removed spinner
* added a new event at the begin of a transaction

## 0.6.0

* add data-remove processing directive
* add data-clear processing directive
* add *-closest variants of data-remove and data-clear
* remove processError and replaced with triggering bootstrap-ajax:error with
  the element and statusCode as parameters


## 0.5.1

* scope the event triggering

## 0.5

* added support for appending fragments
* added support for prepending fragments
* enabled file uploads
* added custom events that are triggered at the end of processing data (both success and error responses)
* added an explicit "json" dataType to the ajax call
* added suport for replacing a selectors inner content

## 0.4

* reset button of form to be enabled when ajax request completes
* only reset form if ajax is succesful
* added ability to prepend response data

## 0.3

* added support for inner fragments

## 0.2

* added support for updating multiple fragments at the same time
* added the clearing of the fields of a submitted form


## 0.1

Initial version
