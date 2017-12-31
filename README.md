# eldarion-ajax

This is a plugin that Eldarion uses for all of its AJAX work.

[![CircleCI](https://circleci.com/gh/eldarion/eldarion-ajax.svg?style=svg)](https://circleci.com/gh/eldarion/eldarion-ajax)
[![codecov](https://codecov.io/gh/eldarion/eldarion-ajax/branch/master/graph/badge.svg)](https://codecov.io/gh/eldarion/eldarion-ajax)
[![](https://data.jsdelivr.com/v1/package/npm/eldarion-ajax/badge)](https://www.jsdelivr.com/package/npm/eldarion-ajax)

No more writing the same 20 line `$.ajax` blocks of Javascript over and over
again for each snippet of AJAX that you want to support. Easily extend support
on the server side code for this by adding a top-level attribute to the JSON you
are already returning called `"html"` that is the rendered content. Unlike a
backbone.js approach to building a web app, eldarion-ajax leverages server side
template rendering engines to render and return HTML fragments.

This project used to be called **bootstrap-ajax** but the connection with
Twitter Bootstrap was tenuous at best so we thought it best to rename to
*eldarion-ajax*.

## Blog Posts

* [An Ajax UX Pattern for Creating, Updating, and Ordering Items](http://eldarion.com/blog/2017/10/06/ux-pattern-creating-updating-and-ordering-items/)
* [Building Cloudspotting Part 1](http://eldarion.com/blog/2016/05/02/building-cloudspotting-part-1/) and [Part 2](http://eldarion.com/blog/2016/05/24/building-cloudspotting-part-2/)
* [Timeouts and Intervals in eldarion-ajax](http://eldarion.com/blog/2013/07/23/timeouts-and-intervals-eldarion-ajax/)
* [bootstrap-ajax renamed to eldarion-ajax](http://eldarion.com/blog/2013/07/12/bootstrap-ajax-renamed-eldarion-ajax/)
* [Twitter Bootstrap and AJAX](http://paltman.com/twitter-bootstrap-and-ajax/)

### Other Mentions

* [Add an AJAX Cart Button to Miva Merchant](http://www.scotsscripts.com/blog/add-an-ajax-cart-button-to-miva-merchant.html)
* [Web development for startups - part 3 (the frontend)](http://www.clickcoder.com/web-development-for-startups-part-3-the-frontend/)
* [20 Plugins for Extending Bootstrap](https://pixel77.com/20-plugins-extending-bootstrap/)
* [Why I don't like jquery-ujs](http://macr.ae/article/jquery-ujs.html)
* [50 Must-have plugins for extending Twitter Bootstrap](https://tutorialzine.com/2013/07/50-must-have-plugins-for-extending-twitter-bootstrap)
* [Plugins for Bootstrap to extend its possibilities](https://netstudy.zlabs.be/40-plugins-for-bootstrap-to-extend-its-possibilities/)


## Demo

There is a demo project at https://github.com/eldarion/eldarion-ajax-demo/.


## Installation

### Download and Include

jQuery is required for this library so make sure it is included somewhere on the
page prior to the inclusion of `eldarion-ajax.min.js`.

Copy `js/eldarion-ajax.min.js` to where you keep your web sites static
media and the include them in your HTML:

```html
<script src="/js/eldarion-ajax.min.js"></script>
```

### CDN Include

```html
<script src="https://cdn.jsdelivr.net/npm/eldarion-ajax@0.16.0/js/eldarion-ajax.min.js"></script>
```


### CommonJS

You can also just include it in your own bundle.

```
npm install eldarion-ajax --save
```

```javascript
require('eldarion-ajax');  // do this in your main bundle file and you'll be all set
```

## Actions

There are three supported actions:

1. [`a.click`](#aclick)
2. [`form.submit`](#formsubmit)
3. [`a.cancel`](#acancel)

### `a.click`

Binding to the `a` tag's click event where the tag has the class `ajax`:

```html
<a href="/tasks/12342/done/" class="btn btn-primary ajax">
    <i class="fa fa-fw fa-check"></i>
    Done
</a>
```

In addition to the `href` attribute, you can add `data-method="post"` to
change the default action from an HTTP GET to an HTTP POST.


### `form.submit`

Convert any form to an AJAX form submission quite easily by adding `ajax`
to the form's class attribute:

```html
<form class="form ajax" action="/tasks/create/" method="post">...</form>
```

When submitting this form the data in the form is serialized and sent to the
server at the url defined in `action` using the `method` that was
declared in the `form` tag.


### `a.cancel`

Any `a` tag that has a `data-cancel-closest` attribute defined will
trigger the "cancel" event handler. This simply removes from the DOM any elements
found using the selector defined in the `data-cancel-closest` attribute:

```html
<a href="#" data-cancel-closest=".edit-form" class="btn btn-secondary ajax">
    Cancel
</a>
```


## Events

These custom events allow you to customize eldarion-ajax behavior.

1. [`eldarion-ajax:begin`](#eldarion-ajaxbegin)
2. [`eldarion-ajax:success`](#eldarion-ajaxsuccess)
3. [`eldarion-ajax:error`](#eldarion-ajaxerror)
4. [`eldarion-ajax:complete`](#eldarion-ajaxcomplete)
5. [`eldarion-ajax:modify-data`](#eldarion-ajaxmodify-data)

All events are triggered on the element that is declared to be ajax. For example
on an anchor:

```html
<a href="/tasks/2323/delete/" class="ajax" data-method="post">
```

the trigger would be fired on the `<a>` element. This event, of course,
bubbles up, but allows you to easily listen only for events on particular tags.

Every event also sends as its first parameter, the element itself, in case you
were listening at a higher level in the chain, you still would have easy access to
the relevant node.


### `eldarion-ajax:begin`

This is the first event that fires and does so before any ajax activity starts.
This allows you to setup a spinner, disable form buttons, etc. before the
requests starts.

A single argument is sent with this event and is the jQuery object for the node:

```javascript
$(document).on(`eldarion-ajax:begin`, function(evt, $el) {
    $el.html(`Processing...`);
});
```

### `eldarion-ajax:success`

This event is triggered if the request succeeds. Four arguments are passed with
this event: the jQuery object; the data returned from the server; a string
describing the status; and the jqXHR object:

```javascript
    $(document).on('eldarion-ajax:success', '[data-prepend-inner]', function(evt, $el, data, textStatus, jqXHR) {
        var $node = $($el.data('prepend-inner'));
        $node.data(data.html + $node.html());
    });
```

### `eldarion-ajax:error`

This event is triggered if the request fails. Four arguments are also passed
with this event: the jQuery object, the jqXHR object; a string describing the
type of error that occurred; and an optional exception object. Possible values
for the third argument (besides null) are "timeout", "error", "abort", and
"parsererror". When an HTTP error occurs, the fourth argument receives the
textual portion of the HTTP status, such as "Not Found" or "Internal Server
Error."


### `eldarion-ajax:complete`

This event is triggered when the request finishes (after the above `success` and
`error` events are completed). This is triggered from the document rather than
the element in context as the handlers processing success messages could replace
the DOM element and therefore would prevent the event from reaching your
listener. The element is always passed as the first argument with this event
(even if it no longer exists in the DOM). In response to a successful request,
the arguments passed with this event are the same as those of the `success`
event: the element, data, textStatus, and the jqXHR object. For failed requests
the arguments are the same as those of the `error` event: the element, the jqXHR
object, textStatus, and errorThrown.


### `eldarion-ajax:modify-data`

This is triggered with jQuery's `triggerHandler` so it functions more like a
callback. If you listen for it, you have to listen on the same element that you
have wired up to send AJAX data on as the event doesn't bubble up. Also, it will
send the original data that it serialized as a parameter and if you want to
change the data at all, you must return new data from the function handling the
event. Otherwise, the original data will be used.


## Responses

There are three data attributes looked for in the response JSON.

1. [`location`](#datalocation) - URL used for immediate redirection
2. [`html`](#datahtml) - content used when processing `html` Directives
3. [`fragments`](#datafragments) - additional content for the DOM

### `data.location`

If `location` is found in the response JSON payload, it is expected to be a URL
and the browser is immediately redirected to that location. No additional HTML
processing is performed.

### `data.html`

The `data.html` response element is typically used for insertion or replacement
of existing DOM element content. Exactly how `data.html` is used depends on one
or more processing directives.

Processing directives are defined by attributes added to the event-handling `class="ajax"` element.
They are linked to handlers as described in [Handlers: A Batteries-Included Framework](#handlers-a-batteries-included-framework).

Each processing directive is assigned a CSS selector. Since a CSS selector
can be written to address multiple different blocks on the page at the same time,
large segments of the DOM can be modified with each directive.

All processing directives are executed for each event and any number of directives may be combined.

### Processing Directives
 
#### data-append

Append response JSON `data.html` to the element(s) found in the specified CSS selector.

```html
<a href="/tasks/12342/done/" class="btn btn-primary ajax" data-method="post"
                                                          data-append=".done-list">
    <i class="fa fa-fw fa-check"></i>
    Done
</a>
```

#### data-clear

Clear the `.html` attribute of each DOM element found in the specified CSS selector.

```html
<a href="/tasks/12342/done/" class="btn btn-primary ajax" data-method="post"
                                                          data-clear=".done-status">
    <i class="fa fa-fw fa-check"></i>
    Done
</a>
```

#### data-clear-closest

Invoke `data-clear` functionality using jQuery's `closest` method to interpret the selector.

#### data-prepend

Prepend response JSON `data.html` to the element(s) found in the specified CSS selector.

```html
<a href="/tasks/12342/done/" class="btn btn-primary ajax" data-method="post"
                                                          data-prepend=".done-list">
    <i class="fa fa-fw fa-check"></i>
    Done
</a>
```

#### data-refresh

Define which elements get **_refreshed_**.
Matching elements are refreshed with the contents of the url defined in their `data-refresh-url`
attribute.

```html
<div class="done-score" data-refresh-url="/users/paltman/done-score/">...</div>

<a href="/tasks/12342/done/" class="btn btn-primary ajax" data-method="post"
                                                          data-refresh=".done-score">
    <i class="fa fa-fw fa-check"></i>
    Done
</a>
```

In this example, `.done-score` will fetch (GET) JSON from the url defined
by `data-refresh-url`, then replace itself with the contents of response JSON `data.html`.

#### data-refresh-closest

Invoke `data-refresh` functionality using jQuery's `closest` method to interpret the selector.

#### data-remove

Remove DOM elements found in the specified CSS selector.

```html
<a href="/tasks/12342/done/" class="btn btn-primary ajax" data-method="post"
                                                          data-remove=".done-status">
    <i class="fa fa-fw fa-check"></i>
    Done
</a>
```

#### data-remove-closest

Invoke `data-remove` functionality using jQuery's `closest` method to interpret the selector.

#### data-replace

Replace the element(s) found in the specified CSS selector with response JSON `data.html`.

```html
<a href="/tasks/12342/done/" class="btn btn-primary ajax" data-method="post"
                                                          data-replace=".done-status">
    <i class="fa fa-fw fa-check"></i>
    Done
</a>
```

#### data-replace-closest

Invoke `data-replace` functionality using jQuery's `closest` method to interpret the selector.

#### data-replace-closest-inner

Invoke `data-replace-inner` functionality using jQuery's `closest` method to interpret the selector.

#### data-replace-inner

Similar to `data-replace` functionality, but replaces the element(s) `.html` attribute.

### A Complex `data.html` Processing Directive Example

This example shows combined use of `data-append`, `data-refresh`, and `data-remove` attributes
as `data.html` processing directives.

```html
<div class="done-score" data-refresh-url="/users/paltman/done-score/">...</div>

<div class="done-list">...</div>

<div class="results"></div>

<a href="/tasks/12342/done/" class="btn btn-primary ajax" data-method="post"
                                                          data-append=".done-list"
                                                          data-refresh=".done-score"
                                                          data-remove=".results">
    <i class="fa fa-fw fa-check"></i>
    Done
</a>
```

It is rare to use many processing directives combined like this. Usually just one or two
suffice.

### `data.fragments`

Response JSON `data.fragments` should contain a list of key/value
pairs where keys are the selectors to content that will be replaced, and
values are the server-side rendered HTML content replacing elements
that match the selection.

#### `data.append-fragments`

Similar to `data.fragments`. Each fragment value is appended to the element(s) found in the key CSS selector.

#### `data.inner-fragments`

Similar to `data.fragments`. Each fragment value replaces the `.html` attribute for the element(s) found in the key CSS selector.

#### `data.prepend-fragments`

Similar to `data.fragments`. Each fragment value is prepended to the element(s) found in the key CSS selector

## Action Attributes

The following attributes are used by eldarion-ajax when processing supported [Actions](#actions).

##### data-cancel-closest

Used on an `<a>` anchor tag, triggers the `cancel` event handler, which removes
from the DOM any elements found in the specified CSS selector.

```html
<a href="#" data-cancel-closest=".edit-form" class="btn btn-secondary ajax">
    Cancel
</a>
```

##### data-method

Defines the request method, i.e. "GET" or "POST".

```html
<a href="/tasks/2323/delete/" class="ajax" data-method="post">
```

##### data-refresh-url

Specify a URL which will return HTML content for the element.

```html
<div class="done-score" data-refresh-url="/users/paltman/done-score/">...</div>
```

### Response Data Pro Tip

Both `data.html` and `data.fragments` are processed in a single response.
This gives you the ability to replace a submitted form with `data.html` content
while also updating multiple fragments of content on the page.


## Handlers: A Batteries-Included Framework

The eldarion-ajax [events](#events) allow you to code handlers which
customize actions for server responses. Many handlers are included
(see [Processing Directives](#processing-directives)),
but here is a quick primer for writing your own.

```javascript
$(function ($) {
    CustomHandlers = {};

    CustomHandlers.prototype.replaceFadeIn = function (e, $el, data) {
        $($el.data('replace-fade-in')).replaceWith(data.html).hide().fadeIn();
    };

    $(function() {
        $(document).on('eldarion-ajax:success', '[data-replace-fade-in]', CustomHandlers.prototype.replaceFadeIn);
    });
}(window.jQuery));
```

This gives you a lot of flexibility. For example, if you don't like how the
batteries included approach treats server response data, you can drop
inclusion of `eldarion-ajax-handlers.js` and write your own handlers.


## Commercial Support

This project, and others like it, have been built in support of many of Eldarion's
own sites, and sites of our clients. We would love to help you on your next project
so get in touch by dropping us a note at info@eldarion.com.
