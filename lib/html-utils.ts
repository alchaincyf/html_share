/**
 * HTML工具函数
 * 用于处理HTML内容的安全性和质量
 */

// 检查HTML内容是否使用了Tailwind CDN
export function containsTailwindCDN(html: string): boolean {
  const cdnPattern = /cdn\.tailwindcss\.com/i;
  return cdnPattern.test(html);
}

// 添加Tailwind CDN警告
export function addTailwindWarning(html: string): string {
  if (!containsTailwindCDN(html)) return html;
  
  const warningComment = `
<!-- 
警告: 在生产环境中不建议使用 cdn.tailwindcss.com
请考虑使用 PostCSS 插件或 Tailwind CLI 构建优化版本
详情请参考: https://tailwindcss.com/docs/installation
-->
`;
  
  return warningComment + html;
}

// 修复常见的JavaScript错误
export function fixCommonJSErrors(html: string): string {
  // 添加基本的null检查以避免"Cannot read properties of null"错误
  const scriptPattern = /<script[\s\S]*?>([\s\S]*?)<\/script>/gi;
  
  return html.replace(scriptPattern, (match, scriptContent) => {
    // 添加一个包装函数，检查元素是否存在
    const safeScript = `
<script>
// 添加安全的元素访问包装函数
function safeDOM(selector, callback) {
  const element = document.querySelector(selector);
  if (element) {
    callback(element);
  }
}

// 原始脚本
${scriptContent}
</script>`;
    
    return safeScript;
  });
}

// 获取安全的HTML内容
export function getSafeHTML(html: string): string {
  if (!html) return '';
  
  let safeHTML = html;
  
  // 移除潜在的恶意代码
  safeHTML = safeHTML
    // 移除JavaScript事件处理程序
    .replace(/on\w+\s*=\s*["']?[^"']*["']?/gi, '')
    // 处理iframe - 确保有安全的sandbox属性
    .replace(/<iframe\s([^>]*?)\s*>/gi, (match, attrs) => {
      // 如果已经有sandbox属性，确保它不包含allow-same-origin
      if (attrs.includes('sandbox')) {
        return match.replace(/sandbox\s*=\s*["']([^"']*)["']/i, (m, sandboxValue) => {
          const safeSandbox = sandboxValue.replace(/allow-same-origin/gi, '').trim();
          return `sandbox="${safeSandbox}"`;
        });
      } else {
        // 添加安全的sandbox属性
        return `<iframe ${attrs} sandbox="allow-scripts allow-forms">`;
      }
    });
  
  // 修复常见的JavaScript错误
  safeHTML = fixCommonJSErrors(safeHTML);
  
  // 添加Tailwind CDN警告
  safeHTML = addTailwindWarning(safeHTML);
  
  return safeHTML;
} 