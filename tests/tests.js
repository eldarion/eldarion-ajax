module("Core Testing of Requests", {
    setup: function () {
        this.requests = [];
        this.xhr = sinon.useFakeXMLHttpRequest();
        this.xhr.onCreate = $.proxy(function(xhr) {
            this.requests.push(xhr);
        }, this);
    },
    teardown: function () {
        this.xhr.restore();
    }
});


test("data-method with value of POST should send a POST request", 3, function () {
    $("#qunit-fixture a.message-post").trigger("click");
    var request = this.requests[0];

    equal(request.method, 'POST');
    equal(request.url, '/test/message/');
    equal(request.requestBody, null);
});

test("data-method with value of GET should send a GET request", 3, function () {
    $("#qunit-fixture a.message-get").trigger("click");
    var request = this.requests[0];

    equal(request.method, 'GET');
    equal(request.url, '/test/message/');
    equal(request.requestBody, null);
});

test("no data-method defined should send a GET request", 3, function () {
    $("#qunit-fixture a.message-default").trigger("click");
    var request = this.requests[0];

    equal(request.method, 'GET');
    equal(request.url, '/test/message/');
    equal(request.requestBody, null);
});

test("X-Eldarion-Ajax header is set", 1, function () {
    $("#qunit-fixture a.message-default").trigger("click");
    var request = this.requests[0];

    equal(request.requestHeaders["X-Eldarion-Ajax"], true);
});

test("form submit with method of POST should send a POST request", 3, function () {
    $("#qunit-fixture .form-post").trigger("submit");
    var request = this.requests[0];

    equal(request.method, 'POST');
    equal(request.url, '/create/message/');
    equal(request.requestBody, "label=Test+Value&number=2");
});

test("form submit with method of GET should send a GET request", 3, function () {
    $("#qunit-fixture .form-get").trigger("submit");
    var request = this.requests[0];

    equal(request.method, 'GET');
    equal(request.url, '/search/message/?label=Test+Value&number=2');
    equal(request.requestBody, null);
});

test("eldarion-ajax:begin event is triggered with element reference from a click", 1, function () {
    $("#qunit-fixture").on("eldarion-ajax:begin", function(evt, $el) {
        equal($el.text(), "Get Default");
    });
    $("#qunit-fixture a.message-default").trigger("click");
    $("#qunit-fixture").off("eldarion-ajax:begin");
});

test("eldarion-ajax:begin event is triggered with element reference from a submit", 1, function () {
    $("#qunit-fixture").on("eldarion-ajax:begin", function(evt, $el) {
        ok($el.hasClass("form-post"));
    });
    $("#qunit-fixture .form-post").trigger("submit");
    $("#qunit-fixture").off("eldarion-ajax:begin");
});


module("Core Response Tests", {
    setup: function () {
        var testData = {"html": "My simple content"};
        this.server = sinon.fakeServer.create();
        this.server.respondWith("GET", "/test/message/", [200, {"Content-Type": "application/json"}, JSON.stringify(testData)]);
        this.server.respondWith("GET", "/test/message/400/", [400, {"Content-Type": "application/json"}, JSON.stringify(testData)]);
        this.server.respondWith("GET", "/test/message/404/", [404, {"Content-Type": "application/json"}, JSON.stringify(testData)]);
        this.server.respondWith("GET", "/test/message/500/", [500, {"Content-Type": "application/json"}, JSON.stringify(testData)]);
        this.server.respondWith("GET", "/test/message/503/", [503, {"Content-Type": "application/json"}, JSON.stringify(testData)]);
        this.server.respondWith("POST", "/create/message/", [200, {"Content-Type": "application/json"}, JSON.stringify(testData)]);
        this.server.respondWith("POST", "/create/message/400/", [400, {"Content-Type": "application/json"}, JSON.stringify(testData)]);
        this.server.respondWith("POST", "/create/message/404/", [404, {"Content-Type": "application/json"}, JSON.stringify(testData)]);
        this.server.respondWith("POST", "/create/message/500/", [500, {"Content-Type": "application/json"}, JSON.stringify(testData)]);
        this.server.respondWith("POST", "/create/message/503/", [503, {"Content-Type": "application/json"}, JSON.stringify(testData)]);
    },
    teardown: function () {
        this.server.restore();
    }
});

test("a.click with 200 status code fires eldarion-ajax:success", 3, function () {
    $("#qunit-fixture").on("eldarion-ajax:success", function(evt, $el, data) {
        equal($el.data("method"), "get");
        equal($el.attr("href"), '/test/message/');
        deepEqual(data, {"html": "My simple content"});
    });
    $("#qunit-fixture a.message-get").trigger("click");
    this.server.respond();
    $("#qunit-fixture").off("eldarion-ajax:success");
});

test("a.click with 400 status code fires eldarion-ajax:error", 3, function () {
    $("#qunit-fixture").on("eldarion-ajax:error", function(evt, $el, statusCode) {
        equal($el.data("method"), "get");
        equal($el.attr("href"), '/test/message/400/');
        equal(statusCode, 400);
    });
    $("#qunit-fixture a.message-get-400").trigger("click");
    this.server.respond();
    $("#qunit-fixture").off("eldarion-ajax:error");
});

test("a.click with 404 status code fires eldarion-ajax:error", 3, function () {
    $("#qunit-fixture").on("eldarion-ajax:error", function(evt, $el, statusCode) {
        equal($el.data("method"), "get");
        equal($el.attr("href"), '/test/message/404/');
        equal(statusCode, 404);
    });
    $("#qunit-fixture a.message-get-404").trigger("click");
    this.server.respond();
    $("#qunit-fixture").off("eldarion-ajax:error");
});


test("a.click with 500 status code fires eldarion-ajax:error", 3, function () {
    $("#qunit-fixture").on("eldarion-ajax:error", function(evt, $el, statusCode) {
        equal($el.data("method"), "get");
        equal($el.attr("href"), '/test/message/500/');
        equal(statusCode, 500);
    });
    $("#qunit-fixture a.message-get-500").trigger("click");
    this.server.respond();
    $("#qunit-fixture").off("eldarion-ajax:error");
});


test("a.click with 503 status code fires eldarion-ajax:complete", 3, function () {
    $(document).on("eldarion-ajax:complete", function(evt, $el, jqXHR, textStatus) {
        equal($el.data("method"), "get");
        equal($el.attr("href"), '/test/message/503/');
        equal(jqXHR.status, 503);
    });
    $("#qunit-fixture a.message-get-503").trigger("click");
    this.server.respond();
    $(document).off("eldarion-ajax:complete");
});

test("form.submit with 200 status code fires eldarion-ajax:success", 3, function () {
    $("#qunit-fixture").on("eldarion-ajax:success", function(evt, $el, data) {
        equal($el.attr("method"), "post");
        equal($el.attr("action"), '/create/message/');
        deepEqual(data, {"html": "My simple content"});
    });
    $("#qunit-fixture .form-post").trigger("submit");
    this.server.respond();
    $("#qunit-fixture").off("eldarion-ajax:success");
});

test("form.submit with 400 status code fires eldarion-ajax:error", 3, function () {
    $("#qunit-fixture").on("eldarion-ajax:error", function(evt, $el, statusCode) {
        equal($el.attr("method"), "post");
        equal($el.attr("action"), '/create/message/400/');
        equal(statusCode, 400);
    });
    $("#qunit-fixture .form-post-400").trigger("submit");
    this.server.respond();
    $("#qunit-fixture").off("eldarion-ajax:error");
});

test("form.submit with 404 status code fires eldarion-ajax:error", 3, function () {
    $("#qunit-fixture").on("eldarion-ajax:error", function(evt, $el, statusCode) {
        equal($el.attr("method"), "post");
        equal($el.attr("action"), '/create/message/404/');
        equal(statusCode, 404);
    });
    $("#qunit-fixture .form-post-404").trigger("submit");
    this.server.respond();
    $("#qunit-fixture").off("eldarion-ajax:error");
});


test("form.submit with 500 status code fires eldarion-ajax:error", 3, function () {
    $("#qunit-fixture").on("eldarion-ajax:error", function(evt, $el, statusCode) {
        equal($el.attr("method"), "post");
        equal($el.attr("action"), '/create/message/500/');
        equal(statusCode, 500);
    });
    $("#qunit-fixture .form-post-500").trigger("submit");
    this.server.respond();
    $("#qunit-fixture").off("eldarion-ajax:error");
});


test("form.submit with 503 status code fires eldarion-ajax:complete", 3, function () {
    $(document).on("eldarion-ajax:complete", function(evt, $el, jqXHR, textStatus) {
        equal($el.attr("method"), "post");
        equal($el.attr("action"), '/create/message/503/');
        equal(jqXHR.status, 503);
    });
    $("#qunit-fixture .form-post-503").trigger("submit");
    this.server.respond();
    $(document).off("eldarion-ajax:complete");
});

