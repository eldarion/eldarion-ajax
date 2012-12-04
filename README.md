# bootstrap-ajax

This plugin is designed to work with Twitter Bootstrap to enable declarative AJAX support.

No more writing the same 20 line ```$.ajax``` blocks of Javascript over and over again for each snippet of AJAX that you want to support. Easily extend support on the server side code for this by adding a top-level attribute to the JSON you are already returning called ```"html"``` that is the rendered content. Unlike a backbone.js approach to building a web app, bootstrap-ajax leverages server side template rendering engines to render and return HTML fragments.

## Demo

There is a demo project at https://github.com/eldarion/bootstrap-ajax-demo/ which is also online at http://uk013.o1.gondor.io/


## Installation

Copy the files in ```js/bootstrap-ajax.js``` and optionally ```vendor/spin.min.js``` to where
you keep your web sites static media and the include them in your HTML:

```
<script src="/js/spin.min.js"></script>
<script src="/js/bootstrap-ajax.js"></script>
```

The inclusion of ```spin.min.js``` is optional.


## Actions
There are currently three actions supported:

1. ```a.click```
2. ```form.submit```
3. ```a.cancel```

### ```a.click```
Binding to the ```a``` tag's click event where the tag has the class ```ajax```:

```
<a href="/tasks/12342/done/" class="btn ajax">
    <i class="icon icon-check"></i>
    Done
</a>
```

In addition to the ```href``` attribute, you can add ```data-method="post"``` to
change the default action from an HTTP GET to an HTTP POST.


### ```form.submit```
Convert any form to an AJAX form submission quite easily by adding ```ajax``` to the
form's class attribute:

```
<form class="form ajax" action="/tasks/create/" method="post">...</form>
```

When submitting this form, any ```input[type=submit]``` or ```button[type=submit]```
will be disabled immediately, then the data in the form is serialized and sent to the
server using the ```method``` that was declared in the ```form``` tag.


### ```a.cancel```
Any ```a``` tag that has a ```data-cancel-closest``` attribute defined will trigger
the cancel event handler. This simply removes from the DOM any elements found using
the selector defined in the ```data-cancel-closest``` attribute:

```
<a href="#" data-cancel-closest=".edit-form" class="btn">
    Cancel
</a>
```


## Processing Responses
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

Using the ```data-refresh``` attribute let's you define what elements, if selected by the
CSS selector specified for it's value, get **_refreshed_**. Elements that are selected will
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

## Spinner
This is an optional include and provides support to show an activity spinner during the life of the callback.

You can specify where the spinner should be placed (it defaults to the ```a.click``` or ```form.submit``` in question) by declaring ```data-spinner``` with a CSS selector. You can turn it off all together by simply specifying ```off``` as the value instead of a selector.


## Commercial Support

This project, and others like it, have been built in support of many of Eldarion's
own sites, and sites of our clients. We would love to help you on your next project
so get in touch by dropping us a note at info@eldarion.com.