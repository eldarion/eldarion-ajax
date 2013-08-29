# eldarion-ajax

This is a plugin that Eldarion uses for all of its AJAX work.

[![Build Status](https://travis-ci.org/eldarion/eldarion-ajax.png)](https://travis-ci.org/eldarion/eldarion-ajax)

No more writing the same 20 line ```$.ajax``` blocks of Javascript over and over
again for each snippet of AJAX that you want to support. Easily extend support
on the server side code for this by adding a top-level attribute to the JSON you
are already returning called ```"html"``` that is the rendered content. Unlike a
backbone.js approach to building a web app, eldarion-ajax leverages server side
template rendering engines to render and return HTML fragments.

This project used to be called **bootstrap-ajax** but the connection with
Twitter Bootstrap was tenuous at best so we thought it best to rename to
*eldarion-ajax*.

## Demo

There is a demo project at https://github.com/eldarion/eldarion-ajax-demo/ which
is also online at http://uk013.gondor.co/


## Installation

jQuery is required for this library so make sure it is included somewhere on the
page prior to the inclusion of ``eldarion-ajax.min.js``.

Copy ```js/eldarion-ajax.min.js``` to where you keep your web sites static 
media and the include them in your HTML:

    <script src="/js/eldarion-ajax.js"></script>


## Actions

There are currently three actions supported:

1. ```a.click```
2. ```form.submit```
3. ```a.cancel```

### ```a.click```

Binding to the ```a``` tag's click event where the tag has the class ```ajax```:

    <a href="/tasks/12342/done/" class="btn ajax">
        <i class="icon icon-check"></i>
        Done
    </a>

In addition to the ```href``` attribute, you can add ```data-method="post"``` to
change the default action from an HTTP GET to an HTTP POST.


### ```form.submit```

Convert any form to an AJAX form submission quite easily by adding ```ajax```
to the form's class attribute:

    <form class="form ajax" action="/tasks/create/" method="post">...</form>

When submitting this form the data in the form is serialized and sent to the
server at the url defined in ```action``` using the ```method``` that was
declared in the ```form``` tag.


### ```a.cancel```

Any ```a``` tag that has a ```data-cancel-closest``` attribute defined will
trigger the cancel event handler. This simply removes from the DOM any elements
found using the selector defined in the ```data-cancel-closest``` attribute:

    <a href="#" data-cancel-closest=".edit-form" class="btn">
        Cancel
    </a>


## Events

There are three custom events that get triggered allowing you to customize the
behavior of eldarion-ajax.

1. ```eldarion-ajax:begin```
2. ```eldarion-ajax:success```
3. ```eldarion-ajax:error```
4. ```eldarion-ajax:complete```
5. ```eldarion-ajax:modify-data```

All events are triggered on the element that is declared to be ajax. For example,
if you had a ```<a href="/tasks/2323/delete/" class="ajax" data-method="post">```
link, the trigger would be fired on the ```<a>``` element. This, of course,
bubbles up, but allows you to easily listen only for events on particular tags.

Every event also sends as its first parameter, the element itself, in case you
were listing at a higher level in the chain, you still would have easy access to
the relevant node.


### ```eldarion-ajax:begin```

This is the first event that fires and does so before any ajax activity starts.
This allows you to setup a spinner, disable form buttons, etc. before the
requests starts.

A single argument is sent with this event and is the jQuery object for the node:

    $(document).on("eldarion-ajax:begin", function(evt, $el) {
        $el.html("Processing...");
    });


### ```eldarion-ajax:success```

This is the event that is triggered once the server receives a successful
response (status code 200) from the server. You can handle this in order to
provide your own processors if the ones that ship by default do not meet your
needs.

Two arguments are passed with this event, the jQuery object for the node, and
the JSON data from the server:

    $(document).on("eldarion-ajax:success", [data-prepend-inner], function(evt, $el, data) {
        var $node = $($el.data("prepend-inner"));
        $node.data(data.html + $node.html());
    });


### ```eldarion-ajax:error```

This event sends a request for 400, 404, and 500 status codes.


### ```eldarion-ajax:complete```

This gets sent on the completion of every ajax request no matter the status
code and in addition to the events listing above. This is triggered from the
document rather than the element in context as the handlers processing success
messages could replace the DOM element and therefore would prevent the event
from reaching your listener.

It is passed the element (even if it no longer exists in the DOM), a ```jaXHR```
object, and ```textStatus```.


### ```eldarion-ajax:modify-data```

This is triggered with jQuery's `triggerHandler` so it functions more like a
callback. If you listen for it, you have to listen on the same element that you
have wired up to send AJAX data on as the event doesn't bubble up. Also, it will
send the original data that it serialized as a parameter and if you want to
change the data at all, you must return new data from the function handling the
event. Otherwise, the original data will be used.


## Handlers: A Framework

The events provided above allow you to roll your own handlers in such a way to
really customize how you want your application to respond to server responses. A
lot have been provided (see the section below), but here is a quick primer on
writing your own.

    $(function ($) {
        CustomHandlers = {};
        
        CustomHandlers.prototype.replaceFadeIn = function (e, $el, data) {
            $($el.data("replace-fade-in")).replaceWith(data.html).hide().fadeIn();
        };
        
        $(function() {
            $(document).on("eldarion-ajax:success", "[data-replace-fade-in]", CustomHandlers.prototype.replaceFadeIn);
        });
    }(window.jQuery));

This gives you a lot of flexibility. For example, if you don't like how the
batteries included approach treats server response data, you can drop the
inclusion of ```eldarion-ajax-handlers.js``` and roll your own.


## Handlers: Batteries Included

There are three data attributes looked for in the response JSON data:

1. ```location```
2. ```html```
3. ```fragments```

If ```location``` is found in the response JSON payload, it is expected to be a URL
and the browser will be immediately redirected to that location. If, on the other hand
it is not present, then the processing rules below will be processed based on
what attributes are defined.

If you have a ```fragments``` hash defined, it should contain a list of key/value
pairs where the keys are the selectors to content that will be replaced, and the
values are the server-side rendered HTML content that will replace the elements
that match the selection.

You can define both ```html``` to be processed by the declaritive rules defined
below and the ```fragements``` at the same time. This gives you the ability to
for example replace the form you submited with ```html``` content while at the
same time updating multiple bits of content on the page without having to
refresh them.

There are five different ways that you can declare an ```html``` response
without a ```location``` directive be processed:

1. Append
2. Refresh
3. Refresh Closest
4. Replace
5. Replace Closest

Here is where it can get fun as all of the values for these processing directives are
just CSS selectors. In addition they can be multiplexed. You can declare all of them
at the same time if you so desire. A CSS selector can easily be written to address
multiple different blocks on the page at the same time.

Best to just see some examples.

### Append

Using ```data-append``` allows you to specify that the ```data.html``` returned in the
server response's JSON be appended to the elements found in the specified CSS selector:

```
<a href="/tasks/12342/done/" class="btn ajax" data-method="post"
                                              data-append=".done-list">
    <i class="icon icon-check"></i>
    Done
</a>
```

### Refresh

Using the ```data-refresh``` attribute lets you define what elements, if selected by the
CSS selector specified for its value, get **_refreshed_**. Elements that are selected will
get refreshed with the contents of the url defined in their ```data-refresh-url```
attribute:

```
<div class="done-score" data-refresh-url="/users/paltman/done-score/">...</div>

<div class="done-list">...</div>

<a href="/tasks/12342/done/" class="btn ajax" data-method="post"
                                              data-append=".done-list"
                                              data-refresh=".done-score">
    <i class="icon icon-check"></i>
    Done
</a>
```

In this example, the ```.done-list``` will be appended to with the ```data.html``` returns from 
the AJAX post made as a result of clicking the button and simultaneously, the ```.done-score```
will refresh itself by fetching (GET) JSON from the url defined in ```data-refresh-url``` and
replacing itself with the contents of ```data.html``` that is returned.

### Refresh Closest

This works very much in the same way as ```data-refresh``` however, the uses jQuery's ```closest```
method to interpret the selector.

### Replace

Sometimes you want to neither refresh nor append to existing elements but you want to just replace
the content with whatever it is that is returned from the server. This is what ```data-replace```
is for.

### Replace Closest

This works very much in the same way as ```data-replace``` however, the uses jQuery's ```closest```
method to interpret the selector.

```
<div class="done-score" data-refresh-url="/users/paltman/done-score/">...</div>

<div class="done-list">...</div>

<div class="results"></div>

<a href="/tasks/12342/done/" class="btn ajax" data-method="post"
                                              data-append=".done-list"
                                              data-refresh=".done-score"
                                              data-replace=".results">
    <i class="icon icon-check"></i>
    Done
</a>
```

It is rare that you'll add/use all of these processing methods combined like this. Usually it will
just be one or the other, however, I add them all here to illustrate the point that they are
independently interpreted and executed.


## Commercial Support

This project, and others like it, have been built in support of many of Eldarion's
own sites, and sites of our clients. We would love to help you on your next project
so get in touch by dropping us a note at info@eldarion.com.
