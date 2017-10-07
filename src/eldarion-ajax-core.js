/* eslint-env amd, node */

(function (root, factory) {
  'use strict';
  /* istanbul ignore next */
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('jquery'));
  } else {
    root.EldarionAjax = factory(root.jQuery);
  }
}(this, function ($) {
  'use strict';

  var Ajax = function () {};

  Ajax.prototype._ajax = function ($el, url, method, data, useFormData) {
    $el.trigger('eldarion-ajax:begin', [$el]);
    var newData = $el.triggerHandler('eldarion-ajax:modify-data', data),
        contentType = 'application/x-www-form-urlencoded; charset=UTF-8',
        processData = true,
        cache = true;

    if (newData) {
      data = newData;
    }
    if (useFormData) {
      contentType = false;
      processData = false;
      cache = false;
    }
    $.ajax({
      url: url,
      type: method,
      dataType: 'json',
      data: data,
      cache: cache,
      processData: processData,
      contentType: contentType,
      headers: {
        'X-Eldarion-Ajax': true
      }
    }).done(function (responseData, textStatus, jqXHR) {
      $el.trigger('eldarion-ajax:success', [$el, responseData, textStatus, jqXHR]);
    }).fail(function (jqXHR, textStatus, errorThrown) {
      $el.trigger('eldarion-ajax:error', [$el, jqXHR, textStatus, errorThrown]);
    }).always(function (responseData, textStatus, jqXHR) {
      $(document).trigger('eldarion-ajax:complete', [$el, responseData, textStatus, jqXHR]);
    });
  };

  Ajax.prototype.click = function (e) {
    var $this = $(this),
        url = $this.attr('href'),
        method = $this.data('method'),
        dataStr = $this.data('data'),
        data = null,
        keyval = null;

    if (!method) {
      method = 'get';
    }

    if (dataStr) {
      data = {};
      dataStr.split(',').map(
        function(pair) {
          keyval = pair.split(':');
          if (keyval[1].indexOf('#') === 0) {
            data[keyval[0]] = $(keyval[1]).val();
          } else {
            data[keyval[0]] = keyval[1];
          }
        }
      );
    }

    e.preventDefault();

    Ajax.prototype._ajax($this, url, method, data);
  };

  Ajax.prototype.submit = function (e) {
    var $this = $(this),
        url = $this.attr('action'),
        method = $this.attr('method') || 'get';

    e.preventDefault();

    if (window.FormData === undefined || method.toLowerCase() === 'get') {
      Ajax.prototype._ajax($this, url, method, $this.serialize());
    } else {
      var data = new FormData($this[0]);
      /* istanbul ignore else */
      if (data.get === undefined) {  // In testing it seems some things have broken FormData support
        data = $this.serialize();
      }
      Ajax.prototype._ajax($this, url, method, data, true);
    }
  };

  Ajax.prototype.cancel = function (e) {
    var $this = $(this),
        selector = $this.attr('data-cancel-closest');
    e.preventDefault();
    $this.closest(selector).remove();
  };

  Ajax.prototype.timeout = function (i, el) {
    var $el = $(el),
        timeout = $el.data('timeout'),
        url = $el.data('url'),
        method = $el.data('method');

    if (!method) {
      method = 'get';
    }

    var id = window.setTimeout(Ajax.prototype._ajax, timeout, $el, url, method, null);
    $el.data('timeout-id', id);
  };

  Ajax.prototype.interval = function (i, el) {
    var $el = $(el),
        interval = $el.data('interval'),
        url = $el.data('url'),
        method = $el.data('method');

    if (!method) {
      method = 'get';
    }

    var id = window.setInterval(Ajax.prototype._ajax, interval, $el, url, method, null);
    $el.data('interval-id', id);
  };

  Ajax.prototype.init = function () {
    $('body').on('click', 'a.ajax', Ajax.prototype.click);
    $('body').on('submit', 'form.ajax', Ajax.prototype.submit);
    $('body').on('click', 'a[data-cancel-closest]', Ajax.prototype.cancel);

    $('[data-timeout]').each(Ajax.prototype.timeout);
    $('[data-interval]').each(Ajax.prototype.interval);
  };

  Ajax.prototype.destroy = function () {
    $('body').off('click', 'a.ajax', Ajax.prototype.click);
    $('body').off('submit', 'form.ajax', Ajax.prototype.submit);
    $('body').off('click', 'a[data-cancel-closest]', Ajax.prototype.cancel);

    $('[data-timeout]').each(function (i, el) {
      window.clearTimeout($(el).data('timeout-id'));
    });
    $('[data-interval]').each(function (i, el) {
      window.clearInterval($(el).data('interval-id'));
    });
  };

  $(function () {
    Ajax.prototype.init();
  });

  return Ajax;
}));
