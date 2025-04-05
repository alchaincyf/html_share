/**
 * 动画工具库 - 使用普通JavaScript文件，避免TypeScript的导入问题
 */

// 导入animejs - 使用ES模块导入语法
import anime from 'animejs/lib/anime.es.js';

/**
 * 执行页面标题和描述的动画
 * @param {Function} onComplete - 动画完成时的回调函数
 */
export function animatePageElements(onComplete) {
  const titleAnimation = anime.timeline({
    easing: 'easeOutExpo',
    complete: onComplete
  });

  titleAnimation
    .add({
      targets: '.page-title',
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 800,
      delay: 200
    })
    .add({
      targets: '.page-description',
      opacity: [0, 1],
      translateY: [15, 0],
      duration: 600
    }, '-=400')
    .add({
      targets: '.editor-container',
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 800
    }, '-=300');
}

/**
 * 为预览容器添加淡入动画
 * @param {HTMLElement} previewContainer - 预览容器元素
 */
export function animatePreviewContainer(previewContainer) {
  anime({
    targets: previewContainer,
    translateY: [20, 0],
    opacity: [0, 1],
    duration: 600,
    easing: 'easeOutQuad'
  });
}

/**
 * 为文本框添加粘贴高亮动画
 * @param {HTMLElement} textarea - 文本框元素
 */
export function animateTextAreaPaste(textarea) {
  anime({
    targets: textarea,
    backgroundColor: ['rgba(79, 70, 229, 0.1)', 'rgba(255, 255, 255, 0)'],
    duration: 1000,
    easing: 'easeOutQuad'
  });
}

/**
 * 为成功指示器添加动画
 * @param {Function} onComplete - 动画完成时的回调函数
 */
export function animateSuccessIndicator(onComplete) {
  anime({
    targets: '.success-indicator',
    scale: [0, 1.2, 1],
    opacity: [0, 1],
    duration: 800,
    easing: 'easeOutElastic(1, .8)',
    complete: onComplete
  });
}

/**
 * 为错误容器添加抖动动画
 */
export function animateErrorContainer() {
  anime({
    targets: '.error-container',
    translateX: [0, -10, 10, -10, 10, 0],
    duration: 500,
    easing: 'easeInOutSine'
  });
}

/**
 * 初始淡入动画
 * @param {number} delay - 延迟时间
 */
export function fadeIn(element, delay = 0) {
  anime({
    targets: element,
    opacity: [0, 1],
    translateY: [20, 0],
    easing: 'easeOutQuad',
    duration: 800,
    delay
  });
}

/**
 * 为列表项添加交错动画
 * @param {NodeListOf<Element>} items - 列表项元素集合
 * @param {number} staggerDelay - 交错延迟
 */
export function staggerItems(items, staggerDelay = 100) {
  anime({
    targets: items,
    opacity: [0, 1],
    translateY: [20, 0],
    easing: 'easeOutQuad',
    duration: 800,
    delay: anime.stagger(staggerDelay)
  });
}

/**
 * 脉冲动画
 * @param {Element} element - 目标元素
 */
export function pulseAnimation(element) {
  anime({
    targets: element,
    scale: [1, 1.05, 1],
    duration: 500,
    easing: 'easeInOutQuad'
  });
} 