var support = (function() {
  var testCSSProperty = function(property) {
    var style = document.documentElement.style;
    var stringType = 'string';
    if (typeof style[property] === stringType) {
      return property
    }
    var prefixes = ['Moz', 'Webkit', 'Khtml', 'O', 'ms'];
    for (var i = 0, l = prefixes.length; i < l; i++) {
      var prefix = prefixes[i];
      var prefixedProperty = prefix + property.charAt(0).toUpperCase() + property.substring(1);
      if (typeof style[prefixedProperty] === stringType) {
        return prefixedProperty
      }
    }
    return false
  };
  var cssTransitionProperty = testCSSProperty('transition');
  return {
    testCSSProperty: testCSSProperty,
    cssTransitionProperty: cssTransitionProperty
  }
})();

var pageMenu = (function () {
  var $window = $(window);
  var $body = $(document.body);
  var $pageMenu = $('.page-menu');
  var $pageMain = $('.page-main');
  var isIOS6 = Boolean(navigator.userAgent.match(/iPhone OS 6_/));
  var transitionSupported = support.cssTransitionProperty && !isIOS6;
  var menuOnClass = 'menu-on';
  var transformClass = transitionSupported ? 'menu-on-transform' : 'menu-on-left';
  var transitionDuration = 1000;
  var timeoutHandle = null;

  var isOpen = function () {
    return $(document.body).hasClass(menuOnClass);
  };

  var showHideMenu = function (state) {
    if (state === isOpen()) {
      return;
    }
    if (state) {
      $pageMenu.show();
    }
    startTransition();
    $body
      .toggleClass(menuOnClass, state)
      .toggleClass(transformClass, state);
    clearTimeout(timeoutHandle);
    timeoutHandle = setTimeout(function () {
      finishTransition(state);
    }, transitionDuration);
  };

  var transitioningClass = 'menu-transitioning';

  var startTransition = function () {
    if (transitionSupported) {
      $body.addClass(transitioningClass);
    }
  };

  var finishTransition = function (state) {
    clearTimeout(timeoutHandle);
    if (transitionSupported) {
      $body.removeClass(transitioningClass);
    }
    if (!state) {
      $pageMenu.hide();
    }
  };

  var lastScrollPosition = 0;

  var show = function () {
    lastScrollPosition = $('body').scrollTop();
    $pageMain.css('top', $('.page-header').height());
    $body.prop('scrollTop', 0);
    showHideMenu(true);
  };

  var hide = function () {
    if (!isOpen()) {
      return
    }
    $pageMain.css('top', '');
    showHideMenu(false);
    window.scrollTo(0, lastScrollPosition);
  };

  var toggle = function () {
    if (isOpen()) {
      hide();
    } else {
      show();
    }
  };

  var init = function () {
    $body.on('click', '.menu-button', function (event) {
      event.stopPropagation();
      toggle()
    }).on('swipeLeft', show);
    $pageMain.on('click swipeLeft', hide);

    var viewportHeight = $window.height();
    $pageMenu.css('min-height', viewportHeight);
    $pageMain.css('min-height', viewportHeight);
  };

  return {
    init: init,
    show: show,
    hide: hide,
    toggle: toggle
  };
})();
pageMenu.init();