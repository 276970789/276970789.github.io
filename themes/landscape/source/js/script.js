(function($){
  var $container = $('#container'),
    $searchWrap = $('#search-form-wrap'),
    $searchButton = $('.nav-search-btn'),
    $searchInput = $('.search-form-input'),
    $mobileNavToggle = $('#main-nav-toggle'),
    isSearchAnim = false,
    searchAnimDuration = 200;

  var setSearchState = function(isOpen){
    var openLabel = $searchButton.attr('data-open-label') || 'Search';
    var closeLabel = $searchButton.attr('data-close-label') || 'Close search';

    $searchWrap.toggleClass('on', isOpen);
    $searchButton.attr('aria-expanded', isOpen ? 'true' : 'false');
    $searchButton.attr('aria-label', isOpen ? closeLabel : openLabel);
  };

  var startSearchAnim = function(){
    isSearchAnim = true;
  };

  var stopSearchAnim = function(callback){
    setTimeout(function(){
      isSearchAnim = false;
      callback && callback();
    }, searchAnimDuration);
  };

  $searchButton.on('click', function(){
    if (isSearchAnim) return;

    startSearchAnim();
    setSearchState(true);
    stopSearchAnim(function(){
      $searchInput.trigger('focus');
    });
  });

  $searchInput.on('blur', function(){
    startSearchAnim();
    setSearchState(false);
    stopSearchAnim();
  });

  // Caption
  $('.article-entry').each(function(i){
    $(this).find('img').each(function(){
      if ($(this).parent().hasClass('fancybox') || $(this).parent().is('a')) return;

      var alt = this.alt;

      if (alt) $(this).after('<span class="caption">' + alt + '</span>');

      $(this).wrap('<a href="' + this.src + '" data-fancybox=\"gallery\" data-caption="' + alt + '"></a>')
    });

    $(this).find('.fancybox').each(function(){
      $(this).attr('rel', 'article' + i);
    });
  });

  if ($.fancybox){
    $('.fancybox').fancybox();
  }

  // Mobile nav
  var isMobileNavAnim = false,
    mobileNavAnimDuration = 200;

  var setMobileNavState = function(isOpen){
    var openLabel = $mobileNavToggle.attr('data-open-label') || 'Open menu';
    var closeLabel = $mobileNavToggle.attr('data-close-label') || 'Close menu';

    $container.toggleClass('mobile-nav-on', isOpen);
    $mobileNavToggle.attr('aria-expanded', isOpen ? 'true' : 'false');
    $mobileNavToggle.attr('aria-label', isOpen ? closeLabel : openLabel);
  };

  var startMobileNavAnim = function(){
    isMobileNavAnim = true;
  };

  var stopMobileNavAnim = function(){
    setTimeout(function(){
      isMobileNavAnim = false;
    }, mobileNavAnimDuration);
  }

  $mobileNavToggle.on('click', function(){
    if (isMobileNavAnim) return;

    startMobileNavAnim();
    setMobileNavState(!$container.hasClass('mobile-nav-on'));
    stopMobileNavAnim();
  });

  $('#wrap').on('click', function(){
    if (isMobileNavAnim || !$container.hasClass('mobile-nav-on')) return;

    setMobileNavState(false);
  });

  $('#header').on('click', function(e){
    if (!$(e.target).closest('#search-form-wrap, .nav-search-btn').length && $searchWrap.hasClass('on')){
      setSearchState(false);
    }
  });

  $('body').on('click', function(e){
    if (!$(e.target).closest('#search-form-wrap, .nav-search-btn').length && $searchWrap.hasClass('on')){
      setSearchState(false);
    }
  });

  $('#mobile-nav').on('click', '.mobile-nav-link', function(){
    setMobileNavState(false);
  });

  $(document).on('keydown', function(e){
    if (e.key !== 'Escape') return;

    if ($container.hasClass('mobile-nav-on')){
      setMobileNavState(false);
    }

    if ($searchWrap.hasClass('on')){
      setSearchState(false);
      $searchButton.trigger('focus');
    }
  });
})(jQuery);
