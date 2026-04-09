(function () {
  // 不支持 IntersectionObserver 或用户开启了减弱动效，直接跳过
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // 需要动画的元素选择器
  var SELECTORS = [
    '.home-stream-header',
    '.home-stream .article',
    '.archive-article-inner',
    '.article-type-post',
    '.article-type-page .article-inner',
  ].join(', ');

  var targets = document.querySelectorAll(SELECTORS);
  if (!targets.length) return;

  // 给每个元素加初始状态
  targets.forEach(function (el) {
    el.classList.add('sr-ready');
  });

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        var el = entry.target;

        // 计算同级中的排序来做 stagger 延迟
        var siblings = el.parentElement
          ? Array.from(el.parentElement.querySelectorAll('.sr-ready:not(.sr-visible)'))
          : [];
        var idx = siblings.indexOf(el);
        var delay = Math.min(idx * 70, 280); // 最多 280ms，防止太晚出现

        el.style.transitionDelay = delay + 'ms';
        el.classList.add('sr-visible');

        // 动画结束后清理 transition-delay，避免影响 hover 等其他效果
        el.addEventListener('transitionend', function cleanup() {
          el.style.transitionDelay = '';
          el.removeEventListener('transitionend', cleanup);
        });

        observer.unobserve(el);
      });
    },
    {
      threshold: 0.08,
      rootMargin: '0px 0px -32px 0px',
    }
  );

  targets.forEach(function (el) {
    observer.observe(el);
  });
})();
