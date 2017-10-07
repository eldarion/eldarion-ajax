/* eslint-env amd, node */

(function (root, factory) {
  'use strict';
  /* istanbul ignore next */
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('jquery'));
  } else {
    root.EldarionAjaxHandlers = factory(root.jQuery);
  }
}(this, function ($) {
  'use strict';

  var Handlers = function () {};

  Handlers.prototype.redirect = function(e, $el, data) {
    /* istanbul ignore next */ // Not testable; at least I haven't been able to figure it out
    if (data.location) {
      window.location.href = data.location;
      return false;
    }
  };
  Handlers.prototype.replace = function(e, $el, data) {
    $($el.data('replace')).replaceWith(data.html);
  };
  Handlers.prototype.replaceClosest = function(e, $el, data) {
    $el.closest($el.data('replace-closest')).replaceWith(data.html);
  };
  Handlers.prototype.replaceInner = function(e, $el, data) {
    $($el.data('replace-inner')).html(data.html);
  };
  Handlers.prototype.replaceClosestInner = function(e, $el, data) {
    $el.closest($el.data('replace-closest-inner')).html(data.html);
  };
  Handlers.prototype.append = function(e, $el, data) {
    $($el.data('append')).append(data.html);
  };
  Handlers.prototype.prepend = function(e, $el, data) {
    $($el.data('prepend')).prepend(data.html);
  };
  Handlers.prototype.refresh = function(e, $el) {
    $.each($($el.data('refresh')), function(index, value) {
      $.getJSON($(value).data('refresh-url'), function(data) {
        $(value).replaceWith(data.html);
      });
    });
  };
  Handlers.prototype.refreshClosest = function(e, $el) {
    $.each($($el.data('refresh-closest')), function(index, value) {
      $.getJSON($(value).data('refresh-url'), function(data) {
        $el.closest($(value)).replaceWith(data.html);
      });
    });
  };
  Handlers.prototype.clear = function(e, $el) {
    $($el.data('clear')).html('');
  };
  Handlers.prototype.remove = function(e, $el) {
    $($el.data('remove')).remove();
  };
  Handlers.prototype.clearClosest = function(e, $el) {
    $el.closest($el.data('clear-closest')).html('');
  };
  Handlers.prototype.removeClosest = function(e, $el) {
    $el.closest($el.data('remove-closest')).remove();
  };
  Handlers.prototype.fragments = function(e, $el, data) {
    if (data.fragments) {
      $.each(data.fragments, function (i, s) {
        $(i).replaceWith(s);
      });
    }
    if (data['inner-fragments']) {
      $.each(data['inner-fragments'], function(i, s) {
        $(i).html(s);
      });
    }
    if (data['append-fragments']) {
      $.each(data['append-fragments'], function(i, s) {
        $(i).append(s);
      });
    }
    if (data['prepend-fragments']) {
      $.each(data['prepend-fragments'], function(i, s) {
        $(i).prepend(s);
      });
    }
  };

  Handlers.prototype.init = function () {
    $(document).on('eldarion-ajax:success', Handlers.prototype.redirect);
    $(document).on('eldarion-ajax:success', Handlers.prototype.fragments);
    $(document).on('eldarion-ajax:success', '[data-replace]', Handlers.prototype.replace);
    $(document).on('eldarion-ajax:success', '[data-replace-closest]', Handlers.prototype.replaceClosest);
    $(document).on('eldarion-ajax:success', '[data-replace-inner]', Handlers.prototype.replaceInner);
    $(document).on('eldarion-ajax:success', '[data-replace-closest-inner]', Handlers.prototype.replaceClosestInner);
    $(document).on('eldarion-ajax:success', '[data-append]', Handlers.prototype.append);
    $(document).on('eldarion-ajax:success', '[data-prepend]', Handlers.prototype.prepend);
    $(document).on('eldarion-ajax:success', '[data-refresh]', Handlers.prototype.refresh);
    $(document).on('eldarion-ajax:success', '[data-refresh-closest]', Handlers.prototype.refreshClosest);
    $(document).on('eldarion-ajax:success', '[data-clear]', Handlers.prototype.clear);
    $(document).on('eldarion-ajax:success', '[data-remove]', Handlers.prototype.remove);
    $(document).on('eldarion-ajax:success', '[data-clear-closest]', Handlers.prototype.clearClosest);
    $(document).on('eldarion-ajax:success', '[data-remove-closest]', Handlers.prototype.removeClosest);
  };

  Handlers.prototype.destroy = function () {
    $(document).off('eldarion-ajax:success', Handlers.prototype.redirect);
    $(document).off('eldarion-ajax:success', Handlers.prototype.fragments);
    $(document).off('eldarion-ajax:success', '[data-replace]', Handlers.prototype.replace);
    $(document).off('eldarion-ajax:success', '[data-replace-closest]', Handlers.prototype.replaceClosest);
    $(document).off('eldarion-ajax:success', '[data-replace-inner]', Handlers.prototype.replaceInner);
    $(document).off('eldarion-ajax:success', '[data-replace-closest-inner]', Handlers.prototype.replaceClosestInner);
    $(document).off('eldarion-ajax:success', '[data-append]', Handlers.prototype.append);
    $(document).off('eldarion-ajax:success', '[data-prepend]', Handlers.prototype.prepend);
    $(document).off('eldarion-ajax:success', '[data-refresh]', Handlers.prototype.refresh);
    $(document).off('eldarion-ajax:success', '[data-refresh-closest]', Handlers.prototype.refreshClosest);
    $(document).off('eldarion-ajax:success', '[data-clear]', Handlers.prototype.clear);
    $(document).off('eldarion-ajax:success', '[data-remove]', Handlers.prototype.remove);
    $(document).off('eldarion-ajax:success', '[data-clear-closest]', Handlers.prototype.clearClosest);
    $(document).off('eldarion-ajax:success', '[data-remove-closest]', Handlers.prototype.removeClosest);
  };

  $(function () {
    Handlers.prototype.init();
  });

  return Handlers;
}));
