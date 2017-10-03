/* eslint-env jasmine */
/* globals $ affix require FormData */

var testData = JSON.stringify({ html: 'My simple content' });
var jsonHeader = { 'Content-Type': 'application/json' };
var responses = {
  message200: {
    header: jsonHeader,
    status: 200,
    responseText: testData
  },
  message200NoData: {
    header: jsonHeader,
    status: 200,
    responseText: ''
  },
  message400: {
    header: jsonHeader,
    status: 400,
    responseText: testData
  },
  message403: {
    header: jsonHeader,
    status: 403,
    responseText: testData
  },
  message404: {
    header: jsonHeader,
    status: 404,
    responseText: testData
  },
  message500: {
    header: jsonHeader,
    status: 500,
    responseText: testData
  },
  message503: {
    header: jsonHeader,
    status: 503,
    responseText: testData
  }
};

describe('eldarion-ajax core', function() {
  'use strict';

  beforeEach(function() {
    jasmine.Ajax.install();
    var e = new window.EldarionAjax();
    e.init();
  });

  afterEach(function() {
    jasmine.Ajax.uninstall();
  });

  it('contains spec with an expectation', function() {
    expect(true).toBe(true);
  });

  it('data-method with value of POST should send a POST request', function() {
    affix('a[data-method="post"][href="/test/message/"][class="ajax"]').click();
    var request = jasmine.Ajax.requests.mostRecent();
    expect(request.url).toMatch(/\/test\/message\/$/);
    expect(request.method).toBe('POST');
    expect(request.body).toBe(undefined);
  });

  it('data-method with value of GET should send a GET request', function () {
    affix('a[data-method="get"][href="/test/message/"][class="ajax"]').click();
    var request = jasmine.Ajax.requests.mostRecent();
    expect(request.url).toMatch(/\/test\/message\/$/);
    expect(request.method).toBe('GET');
    expect(request.requestBody).toBe(undefined);
  });

  it('no data-method defined should send a GET request', function () {
    affix('a[href="/test/message/"][class="ajax"]').click();
    var request = jasmine.Ajax.requests.mostRecent();
    expect(request.url).toMatch(/\/test\/message\/$/);
    expect(request.method).toBe('GET');
    expect(request.requestBody).toBe(undefined);
  });

  it('a tag can send data by defining data-data attribute', function() {
    var div = affix('.content');
    div.affix('input#id_1[value="foo"]');
    div.affix('a[data-method="post"][href="/test/message/"][class="ajax"][data-data="key1:#id_1,key2:14"]').click();
    var request = jasmine.Ajax.requests.mostRecent();
    var data = request.data();
    expect(request.url).toMatch(/\/test\/message\/$/);
    expect(request.method).toBe('POST');
    expect(data['key1'][0]).toBe('foo');
    expect(data['key2'][0]).toBe('14');
  });

  it('X-Eldarion-Ajax header is set', function () {
    affix('a[data-method="post"][href="/test/message/"][class="ajax"][data-data="key1:#id_1,key2:14"]').click();
    var request = jasmine.Ajax.requests.mostRecent();
    expect(request.requestHeaders['X-Eldarion-Ajax']).toBe(true);
  });

  it('form submit with method of POST should send a POST request', function () {
    affix('form[class="ajax"][method="post"][action="/create/message/"]')
      .affix('input[name="label"][value="Test Value"]')
      .affix('input[name="number"][value="2"]')
      .submit();
    var request = jasmine.Ajax.requests.mostRecent();
    var data = request.params;
    expect(request.method).toBe('POST');
    expect(request.url).toBe('/create/message/');
    if (data.get === undefined) {
      expect(data).toBe('label=Test%20Value&number=2');
    } else {
      expect(data.get('label')).toBe('Test Value');
      expect(data.get('number')).toBe('2');
    }
  });

  it('form submit with method of POST should send a POST request with modified data', function () {
    var form = affix('form[class="ajax"][method="post"][action="/create/message/"]');
    form.affix('input[name="label"][value="Test Value"]');
    form.affix('input[name="number"][value="2"]');
    form.on('eldarion-ajax:modify-data', function(evt, data) {
      var $form = $(evt.currentTarget);
      $form.find('[name=label]').val('Changed Value');
      return $form.serialize();
    });
    form.submit();
    var request = jasmine.Ajax.requests.mostRecent();
    var data = request.params;
    expect(request.method).toBe('POST');
    expect(request.url).toBe('/create/message/');
    expect(data).toBe('label=Changed%20Value&number=2');
  });

  it('form submit with method of GET should send a GET request', function () {
    affix('form[class="ajax"][method="get"][action="/search/message/"]')
      .affix('input[name="label"][value="Test Value"]')
      .affix('input[name="number"][value="2"]')
      .submit();
    var request = jasmine.Ajax.requests.mostRecent();
    expect(request.method).toBe('GET');
    expect(request.url).toBe('/search/message/?label=Test%20Value&number=2');
  });

  it('eldarion-ajax:begin event is triggered with element reference from a click', function () {
    $('body').on('eldarion-ajax:begin', function(evt, $el) {
      expect($el.text()).toBe('Get Default');  // not sure how we test so this spec fails if this doesn't execute
    });
    affix('a[class="ajax"]').text('Get Default').click();
    $('body').off('eldarion-ajax:begin');
  });

  it('eldarion-ajax:begin event is triggered with element reference from a submit', function () {
    $('body').on('eldarion-ajax:begin', function(evt, $el) {
      expect($el.hasClass('form-post')).toBe(true);
    });
    affix('form[class="form-post ajax"]').submit();
    $('body').off('eldarion-ajax:begin');
  });

  // Response Tests
  it('a.click with 200 status code fires eldarion-ajax:success', function () {
    $('body').on('eldarion-ajax:success', function(evt, $el, data) {
      expect($el.attr('href')).toBe('/test/message/');
      expect(data.html).toBe('My simple content');
    });
    affix('a.message-get.ajax[href="/test/message/"]').click();
    var request = jasmine.Ajax.requests.mostRecent();
    request.respondWith(responses.message200);
    $('body').off('eldarion-ajax:success');
  });

  it('a.click with 200 status code fires eldarion-ajax:error for blank response data', function () {
    $('body').on('eldarion-ajax:error', function(evt, $el, xhr) {
      expect($el.data('method')).toBe('post');
      expect($el.attr('href')).toBe('/test/message/no-data/');
      expect(xhr.status).toBe(200);
      expect(xhr.statusText).toBe('parsererror');
    });
    affix('a.ajax[data-method="post"][href="/test/message/no-data/"]').click();
    var request = jasmine.Ajax.requests.mostRecent();
    request.respondWith(responses.message200NoData);
    $('body').off('eldarion-ajax:error');
  });

  it('a.click with 400 status code fires eldarion-ajax:error', function () {
    $('body').on('eldarion-ajax:error', function(evt, $el, xhr) {
      expect($el.attr('href')).toBe('/test/message/400/');
      expect(xhr.status).toBe(400);
    });
    affix('a.message-get-400.ajax[href="/test/message/400/"]').click();
    var request = jasmine.Ajax.requests.mostRecent();
    request.respondWith(responses.message400);
    $('body').off('eldarion-ajax:error');
  });

  it('a.click with 403 status code fires eldarion-ajax:error', function () {
    $('body').on('eldarion-ajax:error', function(evt, $el, xhr) {
      expect($el.attr('href')).toBe('/test/message/403/');
      expect(xhr.status).toBe(403);
    });
    affix('a.message-get-403.ajax[href="/test/message/403/"]').click();
    var request = jasmine.Ajax.requests.mostRecent();
    request.respondWith(responses.message403);
    $('body').off('eldarion-ajax:error');
  });

  it('a.click with 404 status code fires eldarion-ajax:error', function () {
    $('body').on('eldarion-ajax:error', function(evt, $el, xhr) {
      expect($el.attr('href')).toBe('/test/message/404/');
      expect(xhr.status).toBe(404);
    });
    affix('a.message-get-404.ajax[href="/test/message/404/"]').click();
    var request = jasmine.Ajax.requests.mostRecent();
    request.respondWith(responses.message404);
    $('body').off('eldarion-ajax:error');
  });


  it('a.click with 500 status code fires eldarion-ajax:error', function () {
    $('body').on('eldarion-ajax:error', function(evt, $el, xhr) {
      expect($el.attr('href')).toBe('/test/message/500/');
      expect(xhr.status).toBe(500);
    });
    affix('a.message-get-500.ajax[href="/test/message/500/"]').click();
    var request = jasmine.Ajax.requests.mostRecent();
    request.respondWith(responses.message500);
    $('body').off('eldarion-ajax:error');
  });

  it('a.click with 503 status code fires eldarion-ajax:error', function () {
    $('body').on('eldarion-ajax:error', function(evt, $el, xhr) {
      expect($el.attr('href')).toBe('/test/message/503/');
      expect(xhr.status).toBe(503);
    });
    affix('a.message-get-503.ajax[href="/test/message/503/"]').click();
    var request = jasmine.Ajax.requests.mostRecent();
    request.respondWith(responses.message503);
    $('body').off('eldarion-ajax:error');
  });

  it('form.submit with 200 status code fires eldarion-ajax:success', function () {
    $('body').on('eldarion-ajax:success', function(evt, $el, data) {
      expect($el.attr('method')).toBe('post');
      expect($el.attr('action')).toBe('/create/message/');
      expect(data.html).toBe('My simple content');
    });
    affix('form.ajax[method="post"][action="/create/message/"]').submit();
    var request = jasmine.Ajax.requests.mostRecent();
    request.respondWith(responses.message200);
    $('body').off('eldarion-ajax:success');
  });

  it('form.submit with 200 status code fires eldarion-ajax:error with parser error', function () {
    $('body').on('eldarion-ajax:error', function(evt, $el, xhr) {
      expect($el.attr('method')).toBe('post');
      expect($el.attr('action')).toBe('/test/message/no-data/');
      expect(xhr.status).toBe(200);
      expect(xhr.statusText).toBe('parsererror');
    });
    affix('form.ajax[method=post][action="/test/message/no-data/"]').submit();
    var request = jasmine.Ajax.requests.mostRecent();
    request.respondWith(responses.message200NoData);
    $('body').off('eldarion-ajax:error');
  });

  it('form.submit with 400 status code fires eldarion-ajax:error', function () {
    $('body').on('eldarion-ajax:error', function(evt, $el, xhr) {
      expect($el.attr('method')).toBe('post');
      expect($el.attr('action')).toBe('/create/message/400/');
      expect(xhr.status).toBe(400);
    });
    affix('form.ajax[method="post"][action="/create/message/400/"]').submit();
    var request = jasmine.Ajax.requests.mostRecent();
    request.respondWith(responses.message400);
    $('body').off('eldarion-ajax:error');
  });

  it('form.submit with 403 status code fires eldarion-ajax:error', function () {
    $('body').on('eldarion-ajax:error', function(evt, $el, xhr) {
      expect($el.attr('method')).toBe('post');
      expect($el.attr('action')).toBe('/create/message/403/');
      expect(xhr.status).toBe(403);
    });
    affix('form.ajax[method="post"][action="/create/message/403/"]').submit();
    var request = jasmine.Ajax.requests.mostRecent();
    request.respondWith(responses.message403);
    $('body').off('eldarion-ajax:error');
  });

  it('form.submit with 404 status code fires eldarion-ajax:error', function () {
    $('body').on('eldarion-ajax:error', function(evt, $el, xhr) {
      expect($el.attr('method')).toBe('post');
      expect($el.attr('action')).toBe('/create/message/404/');
      expect(xhr.status).toBe(404);
    });
    affix('form.ajax[method="post"][action="/create/message/404/"]').submit();
    var request = jasmine.Ajax.requests.mostRecent();
    request.respondWith(responses.message404);
    $('body').off('eldarion-ajax:error');
  });

  it('form.submit with 500 status code fires eldarion-ajax:error', function () {
    $('body').on('eldarion-ajax:error', function(evt, $el, xhr) {
      expect($el.attr('method')).toBe('post');
      expect($el.attr('action')).toBe('/create/message/500/');
      expect(xhr.status).toBe(500);
    });
    affix('form.ajax[method="post"][action="/create/message/500/"]').submit();
    var request = jasmine.Ajax.requests.mostRecent();
    request.respondWith(responses.message500);
    $('body').off('eldarion-ajax:error');
  });

  it('form.submit with 503 status code fires eldarion-ajax:error', function () {
    $('body').on('eldarion-ajax:error', function(evt, $el, xhr) {
      expect($el.attr('method')).toBe('post');
      expect($el.attr('action')).toBe('/create/message/503/');
      expect(xhr.status).toBe(503);
    });
    affix('form.ajax[method="post"][action="/create/message/503/"]').submit();
    var request = jasmine.Ajax.requests.mostRecent();
    request.respondWith(responses.message503);
    $('body').off('eldarion-ajax:error');
  });
});


describe('eldarion-ajax handlers', function() {
  'use strict';

  beforeEach(function() {
    jasmine.Ajax.install();
    var e = new window.EldarionAjax();
    e.init();
    var h = new window.EldarionAjaxHandlers();
    h.init();
  });

  afterEach(function() {
    jasmine.Ajax.uninstall();
  });

  it('a.click with data-replace-inner response populates div.message', function () {
    var container = affix('.container');
    container.affix('.message');
    container.affix('a.ajax[data-replace-inner=".message"][href="/message/"]');
    $('a.ajax').click();
    var request = jasmine.Ajax.requests.mostRecent();
    request.respondWith(responses.message200);
    expect($('.message').html()).toBe('My simple content');
  });
});
