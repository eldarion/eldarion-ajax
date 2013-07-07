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