# ChangeLog

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