'use client';

// 正确导入 anime.js
import * as animeModule from 'animejs';

/**
 * 动画工具库 - 使用普通JavaScript文件，避免TypeScript的导入问题
 */

// 获取正确的 anime 实例，处理各种导入情况
const anime = animeModule.default || animeModule;

// 创建一个安全的anime函数，确保即使在服务器端也能调用
const safeAnime = (...args) => {
  if (typeof window === 'undefined') return {};
  if (typeof anime !== 'function') {
    console.warn('Anime.js not properly loaded, animation skipped');
    return {};
  }
  return anime(...args);
};

// 确保stagger方法可用
safeAnime.stagger = typeof anime !== 'function' || !anime.stagger ? 
  (delay) => delay : 
  anime.stagger;

// 安全的timeline创建函数
safeAnime.timeline = (...args) => {
  if (typeof window === 'undefined' || typeof anime !== 'function' || !anime.timeline) {
    return { add: () => ({}) };
  }
  return anime.timeline(...args);
};

/**
 * 执行页面标题和描述的动画
 * @param {Function} onComplete - 动画完成时的回调函数
 */
export function animatePageElements(onComplete) {
  if (typeof window === 'undefined') {
    if (onComplete) onComplete();
    return;
  }
  
  try {
    const titleAnimation = safeAnime.timeline({
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
  } catch (error) {
    console.error('Animation error:', error);
    if (onComplete) onComplete();
  }
}

/**
 * 为预览容器添加淡入动画
 * @param {HTMLElement} previewContainer - 预览容器元素
 */
export function animatePreviewContainer(previewContainer) {
  if (typeof window === 'undefined') return;
  
  try {
    safeAnime({
      targets: previewContainer,
      translateY: [20, 0],
      opacity: [0, 1],
      duration: 600,
      easing: 'easeOutQuad'
    });
  } catch (error) {
    console.error('Animation error:', error);
  }
}

/**
 * 为文本框添加粘贴高亮动画
 * @param {HTMLElement} textarea - 文本框元素
 */
export function animateTextAreaPaste(textarea) {
  if (typeof window === 'undefined') return;
  
  try {
    safeAnime({
      targets: textarea,
      backgroundColor: ['rgba(79, 70, 229, 0.1)', 'rgba(255, 255, 255, 0)'],
      duration: 1000,
      easing: 'easeOutQuad'
    });
  } catch (error) {
    console.error('Animation error:', error);
  }
}

/**
 * 为成功指示器添加动画
 * @param {Function} onComplete - 动画完成时的回调函数
 */
export function animateSuccessIndicator(onComplete) {
  if (typeof window === 'undefined') {
    if (onComplete) onComplete();
    return;
  }
  
  try {
    safeAnime({
      targets: '.success-indicator',
      scale: [0, 1.2, 1],
      opacity: [0, 1],
      duration: 800,
      easing: 'easeOutElastic(1, .8)',
      complete: onComplete
    });
  } catch (error) {
    console.error('Animation error:', error);
    if (onComplete) onComplete();
  }
}

/**
 * 为错误容器添加抖动动画
 */
export function animateErrorContainer() {
  if (typeof window === 'undefined') return;
  
  try {
    safeAnime({
      targets: '.error-container',
      translateX: [0, -10, 10, -10, 10, 0],
      duration: 500,
      easing: 'easeInOutSine'
    });
  } catch (error) {
    console.error('Animation error:', error);
  }
}

/**
 * 初始淡入动画
 * @param {Element} element - 要动画的元素
 * @param {number} delay - 延迟时间
 */
export function fadeIn(element, delay = 0) {
  if (typeof window === 'undefined') return;
  
  try {
    safeAnime({
      targets: element,
      opacity: [0, 1],
      translateY: [20, 0],
      easing: 'easeOutQuad',
      duration: 800,
      delay
    });
  } catch (error) {
    console.error('Animation error:', error);
  }
}

/**
 * 为列表项添加交错动画
 * @param {NodeListOf<Element>} items - 列表项元素集合
 * @param {number} staggerDelay - 交错延迟
 */
export function staggerItems(items, staggerDelay = 100) {
  if (typeof window === 'undefined') return;
  
  try {
    safeAnime({
      targets: items,
      opacity: [0, 1],
      translateY: [20, 0],
      easing: 'easeOutQuad',
      duration: 800,
      delay: safeAnime.stagger(staggerDelay)
    });
  } catch (error) {
    console.error('Animation error:', error);
  }
}

/**
 * 脉冲动画
 * @param {Element} element - 目标元素
 */
export function pulseAnimation(element) {
  if (typeof window === 'undefined') return;
  
  try {
    safeAnime({
      targets: element,
      scale: [1, 1.05, 1],
      duration: 500,
      easing: 'easeInOutQuad'
    });
  } catch (error) {
    console.error('Animation error:', error);
  }
} 