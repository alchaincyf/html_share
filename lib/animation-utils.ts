// @ts-expect-error animejs导入问题
import anime from 'animejs';

export const fadeIn = (element: Element, delay = 0, duration = 800) => {
  return anime({
    targets: element,
    opacity: [0, 1],
    translateY: [20, 0],
    easing: 'easeOutQuad',
    duration,
    delay
  });
};

export const staggerAnimation = (elements: Element[], staggerDelay = 100, duration = 800) => {
  return anime({
    targets: elements,
    opacity: [0, 1],
    translateY: [20, 0],
    easing: 'easeOutQuad',
    duration,
    delay: anime.stagger(staggerDelay)
  });
};

export const pulseAnimation = (element: Element) => {
  return anime({
    targets: element,
    scale: [1, 1.05, 1],
    duration: 500,
    easing: 'easeInOutQuad'
  });
};

export const buttonClickAnimation = (element: Element) => {
  return anime({
    targets: element,
    scale: [1, 0.95, 1],
    duration: 300,
    easing: 'easeInOutQuad'
  });
};

export const rippleEffect = (e: React.MouseEvent<HTMLElement>) => {
  const button = e.currentTarget;
  const rect = button.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  const circle = document.createElement("span");
  const diameter = Math.max(rect.width, rect.height);
  
  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${x - diameter / 2}px`;
  circle.style.top = `${y - diameter / 2}px`;
  circle.classList.add("ripple");
  
  const ripple = button.getElementsByClassName("ripple")[0];
  if (ripple) {
    ripple.remove();
  }
  
  button.appendChild(circle);
  
  return anime({
    targets: circle,
    scale: [0, 1],
    opacity: [1, 0],
    easing: 'easeOutQuad',
    duration: 600,
    complete: () => {
      circle.remove();
    }
  });
};

// 为列表项添加交错动画效果
export const animateListItems = (containerSelector: string) => {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  
  const items = container.querySelectorAll('.animate-item');
  return staggerAnimation(Array.from(items), 80);
};

// 为页面切换添加动画
export const pageTransitionOut = (container: Element, done: () => void) => {
  anime({
    targets: container,
    opacity: [1, 0],
    translateY: [0, -20],
    easing: 'easeInQuad',
    duration: 300,
    complete: done
  });
};

export const pageTransitionIn = (container: Element) => {
  return anime({
    targets: container,
    opacity: [0, 1],
    translateY: [20, 0],
    easing: 'easeOutQuad',
    duration: 500
  });
}; 