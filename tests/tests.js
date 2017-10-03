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
