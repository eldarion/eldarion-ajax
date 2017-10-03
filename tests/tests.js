module("Core Response Tests (jQuery " + jQuery.fn.jquery + ")", {
    setup: function () {
        var testData = {"html": "My simple content"};
        this.server = sinon.fakeServer.create();
        this.server.respondWith("GET", "/test/message/", [200, {"Content-Type": "application/json"}, JSON.stringify(testData)]);
        this.server.respondWith("POST", "/test/message/no-data/", [200, {"Content-Type": "text/html"}, ""]);
        this.server.respondWith("GET", "/test/message/400/", [400, {"Content-Type": "application/json"}, JSON.stringify(testData)]);
        this.server.respondWith("GET", "/test/message/403/", [403, {"Content-Type": "application/json"}, JSON.stringify(testData)]);
        this.server.respondWith("GET", "/test/message/404/", [404, {"Content-Type": "application/json"}, JSON.stringify(testData)]);
        this.server.respondWith("GET", "/test/message/500/", [500, {"Content-Type": "application/json"}, JSON.stringify(testData)]);
        this.server.respondWith("GET", "/test/message/503/", [503, {"Content-Type": "application/json"}, JSON.stringify(testData)]);
        this.server.respondWith("POST", "/create/message/", [200, {"Content-Type": "application/json"}, JSON.stringify(testData)]);
        this.server.respondWith("POST", "/create/message/400/", [400, {"Content-Type": "application/json"}, JSON.stringify(testData)]);
        this.server.respondWith("POST", "/create/message/403/", [403, {"Content-Type": "application/json"}, JSON.stringify(testData)]);
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
        equal($el.data("method"), "get", 'request method is GET');
        equal($el.attr("href"), '/test/message/', 'request url matches');
        deepEqual(data, {"html": "My simple content"}, 'event passed the correct data');
    });
    $("#qunit-fixture a.message-get").trigger("click");
    this.server.respond();
    $("#qunit-fixture").off("eldarion-ajax:success");
});

test("a.click with 200 status code fires eldarion-ajax:success with default data", 3, function () {
    $("#qunit-fixture").on("eldarion-ajax:success", function(evt, $el, data) {
        equal($el.data("method"), "post", 'request method is POST');
        equal($el.attr("href"), '/test/message/no-data/', 'request url matches');
        notEqual(data, undefined, 'event passed the correct data');
    });
    $("#qunit-fixture a.message-post-no-data").trigger("click");
    this.server.respond();
    $("#qunit-fixture").off("eldarion-ajax:success");
});

test("a.click with 400 status code fires eldarion-ajax:error", 3, function () {
    $("#qunit-fixture").on("eldarion-ajax:error", function(evt, $el, statusCode) {
        equal($el.data("method"), "get", 'request method is GET');
        equal($el.attr("href"), '/test/message/400/', 'request url matches');
        equal(statusCode, 400, 'statusCode was 400');
    });
    $("#qunit-fixture a.message-get-400").trigger("click");
    this.server.respond();
    $("#qunit-fixture").off("eldarion-ajax:error");
});

test("a.click with 403 status code fires eldarion-ajax:error", 3, function () {
    $("#qunit-fixture").on("eldarion-ajax:error", function(evt, $el, statusCode) {
        equal($el.data("method"), "get", 'request method is GET');
        equal($el.attr("href"), '/test/message/403/', 'request url matches');
        equal(statusCode, 403, 'statusCode was 403');
    });
    $("#qunit-fixture a.message-get-403").trigger("click");
    this.server.respond();
    $("#qunit-fixture").off("eldarion-ajax:error");
});

test("a.click with 404 status code fires eldarion-ajax:error", 3, function () {
    $("#qunit-fixture").on("eldarion-ajax:error", function(evt, $el, statusCode) {
        equal($el.data("method"), "get", 'request method is GET');
        equal($el.attr("href"), '/test/message/404/', 'request url matches');
        equal(statusCode, 404, 'statusCode was 404');
    });
    $("#qunit-fixture a.message-get-404").trigger("click");
    this.server.respond();
    $("#qunit-fixture").off("eldarion-ajax:error");
});


test("a.click with 500 status code fires eldarion-ajax:error", 3, function () {
    $("#qunit-fixture").on("eldarion-ajax:error", function(evt, $el, statusCode) {
        equal($el.data("method"), "get", 'request method is GET');
        equal($el.attr("href"), '/test/message/500/', 'request url matches');
        equal(statusCode, 500, 'statusCode was 500');
    });
    $("#qunit-fixture a.message-get-500").trigger("click");
    this.server.respond();
    $("#qunit-fixture").off("eldarion-ajax:error");
});


test("a.click with 503 status code fires eldarion-ajax:complete", 3, function () {
    $(document).on("eldarion-ajax:complete", function(evt, $el, jqXHR, textStatus) {
        equal($el.data("method"), "get", 'request method is GET');
        equal($el.attr("href"), '/test/message/503/', 'request url matches');
        equal(jqXHR.status, 503, 'statusCode was 503');
    });
    $("#qunit-fixture a.message-get-503").trigger("click");
    this.server.respond();
    $(document).off("eldarion-ajax:complete");
});

test("form.submit with 200 status code fires eldarion-ajax:success", 3, function () {
    $("#qunit-fixture").on("eldarion-ajax:success", function(evt, $el, data) {
        equal($el.attr("method"), "post", 'request method is POST');
        equal($el.attr("action"), '/create/message/', 'request url matches');
        deepEqual(data, {"html": "My simple content"}, 'event sent the correct data');
    });
    $("#qunit-fixture .form-post").trigger("submit");
    this.server.respond();
    $("#qunit-fixture").off("eldarion-ajax:success");
});

test("form.submit with 400 status code fires eldarion-ajax:error", 3, function () {
    $("#qunit-fixture").on("eldarion-ajax:error", function(evt, $el, statusCode) {
        equal($el.attr("method"), "post", 'request method is POST');
        equal($el.attr("action"), '/create/message/400/', 'request url matches');
        equal(statusCode, 400, 'statusCode was 400');
    });
    $("#qunit-fixture .form-post-400").trigger("submit");
    this.server.respond();
    $("#qunit-fixture").off("eldarion-ajax:error");
});

test("form.submit with 403 status code fires eldarion-ajax:error", 3, function () {
    $("#qunit-fixture").on("eldarion-ajax:error", function(evt, $el, statusCode) {
        equal($el.attr("method"), "post", 'request method is POST');
        equal($el.attr("action"), '/create/message/403/', 'request url matches');
        equal(statusCode, 403, 'statusCode was 403');
    });
    $("#qunit-fixture .form-post-403").trigger("submit");
    this.server.respond();
    $("#qunit-fixture").off("eldarion-ajax:error");
});

test("form.submit with 404 status code fires eldarion-ajax:error", 3, function () {
    $("#qunit-fixture").on("eldarion-ajax:error", function(evt, $el, statusCode) {
        equal($el.attr("method"), "post", 'request method is POST');
        equal($el.attr("action"), '/create/message/404/', 'request url matches');
        equal(statusCode, 404, 'statusCode was 404');
    });
    $("#qunit-fixture .form-post-404").trigger("submit");
    this.server.respond();
    $("#qunit-fixture").off("eldarion-ajax:error");
});


test("form.submit with 500 status code fires eldarion-ajax:error", 3, function () {
    $("#qunit-fixture").on("eldarion-ajax:error", function(evt, $el, statusCode) {
        equal($el.attr("method"), "post", 'request method is POST');
        equal($el.attr("action"), '/create/message/500/', 'request url matches');
        equal(statusCode, 500, 'statusCode was 500');
    });
    $("#qunit-fixture .form-post-500").trigger("submit");
    this.server.respond();
    $("#qunit-fixture").off("eldarion-ajax:error");
});

test("form.submit with 200 status code fires eldarion-ajax:success with default data", 3, function () {
    $("#qunit-fixture").on("eldarion-ajax:success", function(evt, $el, data) {
        equal($el.attr("method"), "post", 'request method is POST');
        equal($el.attr("action"), '/test/message/no-data/', 'request url matches');
        notEqual(data, undefined, 'event passed the correct data');
    });
    $("#qunit-fixture .form-post-no-data").trigger("submit");
    this.server.respond();
    $("#qunit-fixture").off("eldarion-ajax:success");
});

test("form.submit with 503 status code fires eldarion-ajax:complete", 3, function () {
    $(document).on("eldarion-ajax:complete", function(evt, $el, jqXHR, textStatus) {
        equal($el.attr("method"), "post", 'request method is POST');
        equal($el.attr("action"), '/create/message/503/', 'request url matches');
        equal(jqXHR.status, 503, 'statusCode was 503');
    });
    $("#qunit-fixture .form-post-503").trigger("submit");
    this.server.respond();
    $(document).off("eldarion-ajax:complete");
});


module("Handler Tests (jQuery " + jQuery.fn.jquery + ")", {
    setup: function () {
        var testData = {"html": "My good content"};
        this.server = sinon.fakeServer.create();
        this.server.respondWith("GET", "/test/message/", [200, {"Content-Type": "application/json"}, JSON.stringify(testData)]);
        this.server.respondWith("POST", "/test/message/no-data/", [200, {"Content-Type": "text/html"}, ""]);
        this.server.respondWith("GET", "/test/message/400/", [400, {"Content-Type": "application/json"}, JSON.stringify(testData)]);
        this.server.respondWith("GET", "/test/message/403/", [403, {"Content-Type": "application/json"}, JSON.stringify(testData)]);
        this.server.respondWith("GET", "/test/message/404/", [404, {"Content-Type": "application/json"}, JSON.stringify(testData)]);
        this.server.respondWith("GET", "/test/message/500/", [500, {"Content-Type": "application/json"}, JSON.stringify(testData)]);
        this.server.respondWith("GET", "/test/message/503/", [503, {"Content-Type": "application/json"}, JSON.stringify(testData)]);
        this.server.respondWith("POST", "/create/message/", [200, {"Content-Type": "application/json"}, JSON.stringify(testData)]);
        this.server.respondWith("POST", "/create/message/400/", [400, {"Content-Type": "application/json"}, JSON.stringify(testData)]);
        this.server.respondWith("POST", "/create/message/403/", [403, {"Content-Type": "application/json"}, JSON.stringify(testData)]);
        this.server.respondWith("POST", "/create/message/404/", [404, {"Content-Type": "application/json"}, JSON.stringify(testData)]);
        this.server.respondWith("POST", "/create/message/500/", [500, {"Content-Type": "application/json"}, JSON.stringify(testData)]);
        this.server.respondWith("POST", "/create/message/503/", [503, {"Content-Type": "application/json"}, JSON.stringify(testData)]);
    },
    teardown: function () {
        this.server.restore();
        $(".message").html("");
    }
});

test("a.click with data-replace-inner response populates div.message", 1, function () {
    $("#qunit-fixture a.message-get").trigger("click");
    this.server.respond();
    equal($(".message").html(), "My good content", "div.message filled with correct data");
});



module("Blank Handler Tests (jQuery " + jQuery.fn.jquery + ")", {
    setup: function () {
        var testData = {"html": ""};
        this.server = sinon.fakeServer.create();
        this.server.respondWith("GET", "/test/message/", [200, {"Content-Type": "application/json"}, JSON.stringify(testData)]);
        this.server.respondWith("POST", "/test/message/no-data/", [200, {"Content-Type": "text/html"}, ""]);
        this.server.respondWith("GET", "/test/message/400/", [400, {"Content-Type": "application/json"}, JSON.stringify(testData)]);
        this.server.respondWith("GET", "/test/message/403/", [403, {"Content-Type": "application/json"}, JSON.stringify(testData)]);
        this.server.respondWith("GET", "/test/message/404/", [404, {"Content-Type": "application/json"}, JSON.stringify(testData)]);
        this.server.respondWith("GET", "/test/message/500/", [500, {"Content-Type": "application/json"}, JSON.stringify(testData)]);
        this.server.respondWith("GET", "/test/message/503/", [503, {"Content-Type": "application/json"}, JSON.stringify(testData)]);
        this.server.respondWith("POST", "/create/message/", [200, {"Content-Type": "application/json"}, JSON.stringify(testData)]);
        this.server.respondWith("POST", "/create/message/400/", [400, {"Content-Type": "application/json"}, JSON.stringify(testData)]);
        this.server.respondWith("POST", "/create/message/403/", [403, {"Content-Type": "application/json"}, JSON.stringify(testData)]);
        this.server.respondWith("POST", "/create/message/404/", [404, {"Content-Type": "application/json"}, JSON.stringify(testData)]);
        this.server.respondWith("POST", "/create/message/500/", [500, {"Content-Type": "application/json"}, JSON.stringify(testData)]);
        this.server.respondWith("POST", "/create/message/503/", [503, {"Content-Type": "application/json"}, JSON.stringify(testData)]);
    },
    teardown: function () {
        this.server.restore();
        $(".message").html("");
    }
});

test("a.click with data-replace-inner response populates div.message", 1, function () {
    $("#qunit-fixture a.message-get").trigger("click");
    this.server.respond();
    equal($(".message").html(), "", "div.message is blank");
});
