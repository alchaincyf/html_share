'use client';

/**
 * 动画工具库 - 使用简化方式实现动画效果
 */

// 创建原生DOM动画函数，不依赖anime.js
// 这样可以避免第三方库加载问题
const nativeAnimate = {
  // 淡入并向上移动元素
  fadeIn: (element, delay = 0, duration = 500) => {
    if (typeof window === 'undefined' || !element) return;
    
    setTimeout(() => {
      if (element instanceof Element || (typeof element === 'string' && document.querySelector(element))) {
        const targets = typeof element === 'string' ? document.querySelectorAll(element) : [element];
        targets.forEach(target => {
          if (target) {
            // 设置初始状态
            target.style.opacity = '0';
            target.style.transform = 'translateY(20px)';
            target.style.transition = `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`;
            
            // 强制回流后应用动画
            void target.offsetWidth;
            
            // 设置最终状态
            target.style.opacity = '1';
            target.style.transform = 'translateY(0)';
          }
        });
      }
    }, delay);
  },
  
  // 为多个元素添加交错动画
  stagger: (elements, staggerDelay = 100, duration = 500) => {
    if (typeof window === 'undefined' || !elements) return;
    
    const targets = typeof elements === 'string' ? 
      Array.from(document.querySelectorAll(elements)) : 
      (Array.isArray(elements) ? elements : [elements]);
      
    targets.forEach((target, index) => {
      setTimeout(() => {
        if (target) {
          // 设置初始状态
          target.style.opacity = '0';
          target.style.transform = 'translateY(20px)';
          target.style.transition = `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`;
          
          // 强制回流后应用动画
          void target.offsetWidth;
          
          // 设置最终状态
          target.style.opacity = '1';
          target.style.transform = 'translateY(0)';
        }
      }, index * staggerDelay);
    });
  },
  
  // 添加抖动动画
  shake: (element, duration = 500) => {
    if (typeof window === 'undefined' || !element) return;
    
    const target = typeof element === 'string' ? document.querySelector(element) : element;
    if (!target) return;
    
    // 添加CSS keyframes动画
    target.style.animation = `shake ${duration}ms ease-in-out`;
    
    // 动画结束后移除
    setTimeout(() => {
      target.style.animation = '';
    }, duration);
  },
  
  // 成功指示器动画
  successIndicator: (element, onComplete) => {
    if (typeof window === 'undefined') {
      if (onComplete) onComplete();
      return;
    }
    
    const target = typeof element === 'string' ? document.querySelector(element) : element;
    if (!target) {
      if (onComplete) onComplete();
      return;
    }
    
    // 显示元素
    target.style.display = 'block';
    
    // 添加缩放动画
    target.style.transform = 'scale(0)';
    target.style.opacity = '0';
    target.style.transition = 'transform 600ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 300ms ease-out';
    
    // 强制回流
    void target.offsetWidth;
    
    // 应用动画
    target.style.transform = 'scale(1)';
    target.style.opacity = '1';
    
    // 完成回调
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 800);
  }
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
    // 依次为页面元素添加动画
    const title = document.querySelector('.page-title');
    const description = document.querySelector('.page-description');
    const editor = document.querySelector('.editor-container');
    
    // 设置所有元素为可见
    if (title) title.style.opacity = '0';
    if (description) description.style.opacity = '0';
    if (editor) editor.style.opacity = '0';
    
    // 按顺序执行动画
    nativeAnimate.fadeIn(title, 200, 800);
    
    setTimeout(() => {
      nativeAnimate.fadeIn(description, 0, 600);
    }, 400);
    
    setTimeout(() => {
      nativeAnimate.fadeIn(editor, 0, 800);
      
      // 完成后调用回调
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 800);
    }, 700);
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
  nativeAnimate.fadeIn(previewContainer, 0, 600);
}

/**
 * 为文本框添加粘贴高亮动画
 * @param {HTMLElement} textarea - 文本框元素
 */
export function animateTextAreaPaste(textarea) {
  if (typeof window === 'undefined' || !textarea) return;
  
  try {
    // 添加一个临时的背景色类
    textarea.style.transition = 'background-color 1000ms ease-out';
    textarea.style.backgroundColor = 'rgba(79, 70, 229, 0.1)';
    
    // 逐渐恢复
    setTimeout(() => {
      textarea.style.backgroundColor = 'transparent';
    }, 50);
  } catch (error) {
    console.error('Animation error:', error);
  }
}

/**
 * 为成功指示器添加动画
 * @param {Function} onComplete - 动画完成时的回调函数
 */
export function animateSuccessIndicator(onComplete) {
  nativeAnimate.successIndicator('.success-indicator', onComplete);
}

/**
 * 为错误容器添加抖动动画
 */
export function animateErrorContainer() {
  nativeAnimate.shake('.error-container');
}

/**
 * 初始淡入动画
 * @param {Element} element - 要动画的元素
 * @param {number} delay - 延迟时间
 */
export function fadeIn(element, delay = 0) {
  nativeAnimate.fadeIn(element, delay);
}

/**
 * 为列表项添加交错动画
 * @param {NodeListOf<Element>} items - 列表项元素集合
 * @param {number} staggerDelay - 交错延迟
 */
export function staggerItems(items, staggerDelay = 100) {
  nativeAnimate.stagger(items, staggerDelay);
}

/**
 * 脉冲动画
 * @param {Element} element - 目标元素
 */
export function pulseAnimation(element) {
  if (typeof window === 'undefined' || !element) return;
  
  try {
    element.style.transition = 'transform 500ms ease-in-out';
    element.style.transform = 'scale(1.05)';
    
    setTimeout(() => {
      element.style.transform = 'scale(1)';
    }, 250);
  } catch (error) {
    console.error('Animation error:', error);
  }
} 