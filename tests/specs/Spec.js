/* eslint-env jasmine */
/* globals $ affix require FormData */

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
      expect(data).toEqual('label=Test%20Value&number=2');
    } else {
      expect(data.get('label')).toEqual('Test Value');
      expect(data.get('number')).toEqual('2');
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
    expect(data).toEqual('label=Changed%20Value&number=2');
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
});
