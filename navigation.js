/**
 * 页面导航和登录功能实现
 * 主要功能：
 * 1. 处理登录表单提交
 * 2. 实现页面跳转导航
 * 3. 用户状态管理
 */

// 用户状态管理
class UserManager {
    constructor() {
        this.currentUser = null;
        this.isLoggedIn = false;
    }

    // 登录方法
    login(username, password) {
        // 模拟登录验证（实际项目中应该调用后端API）
        if (username && password) {
            this.currentUser = username;
            this.isLoggedIn = true;
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUser', username);
            return true;
        }
        return false;
    }

    // 登出方法
    logout() {
        this.currentUser = null;
        this.isLoggedIn = false;
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
    }

    // 检查登录状态
    checkLoginStatus() {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const currentUser = localStorage.getItem('currentUser');
        
        if (isLoggedIn && currentUser) {
            this.currentUser = currentUser;
            this.isLoggedIn = true;
        }
        
        return this.isLoggedIn;
    }
}

// 页面导航管理
class NavigationManager {
    constructor() {
        this.currentPage = window.location.pathname;
        this.navigationHistory = [];
    }

    // 导航到指定页面
    navigateTo(url, options = {}) {
        const { 
            animate = true, 
            addToHistory = true,
            callback = null 
        } = options;

        // 添加到导航历史
        if (addToHistory) {
            this.navigationHistory.push(this.currentPage);
        }

        // 执行页面跳转动画
        if (animate) {
            this.animatePageTransition(() => {
                window.location.href = url;
                if (callback) callback();
            });
        } else {
            window.location.href = url;
            if (callback) callback();
        }

        this.currentPage = url;
    }

    // 返回上一页
    goBack() {
        if (this.navigationHistory.length > 0) {
            const previousPage = this.navigationHistory.pop();
            this.navigateTo(previousPage, { addToHistory: false });
        } else {
            window.history.back();
        }
    }

    // 页面切换动画
    animatePageTransition(callback) {
        const body = document.body;
        body.style.opacity = '0';
        body.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            if (callback) callback();
        }, 200);
    }

    // 平滑滚动到页面顶部
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// 创建全局实例
const userManager = new UserManager();
const navigationManager = new NavigationManager();

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 页面加载动画
    document.body.classList.add('page-transition');
    setTimeout(() => {
        document.body.classList.add('active');
    }, 100);

    // 检查登录状态
    userManager.checkLoginStatus();

    // 登录表单处理
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // 为所有导航链接添加点击事件
    const navLinks = document.querySelectorAll('a[href]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const url = this.getAttribute('href');
            
            // 添加点击动画效果
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
                navigationManager.navigateTo(url);
            }, 150);
        });
    });

    // 为按钮添加波纹效果
    addRippleEffect();
});

/**
 * 处理登录表单提交
 * @param {Event} event - 表单提交事件
 */
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // 输入验证
    if (!username || !password) {
        showMessage('请输入用户名和密码', 'error');
        return;
    }

    // 添加加载状态
    const submitBtn = event.target.querySelector('.login-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = '登录中...';
    submitBtn.disabled = true;

    // 模拟网络请求延迟
    setTimeout(() => {
        const loginSuccess = userManager.login(username, password);
        
        if (loginSuccess) {
            showMessage('登录成功！', 'success');
            // 延迟跳转到主页面
            setTimeout(() => {
                navigationManager.navigateTo('dashboard.html');
            }, 1000);
        } else {
            showMessage('用户名或密码错误', 'error');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }, 1000);
}

/**
 * 显示消息提示
 * @param {string} message - 消息内容
 * @param {string} type - 消息类型 ('success', 'error', 'info')
 */
function showMessage(message, type = 'info') {
    // 创建消息元素
    const messageEl = document.createElement('div');
    messageEl.className = `message message-${type}`;
    messageEl.textContent = message;
    
    // 添加消息样式
    messageEl.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 5px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;

    // 根据类型设置颜色
    switch(type) {
        case 'success':
            messageEl.style.background = '#4CAF50';
            break;
        case 'error':
            messageEl.style.background = '#f44336';
            break;
        default:
            messageEl.style.background = '#2196F3';
    }

    document.body.appendChild(messageEl);

    // 显示动画
    setTimeout(() => {
        messageEl.style.opacity = '1';
        messageEl.style.transform = 'translateX(0)';
    }, 10);

    // 自动隐藏
    setTimeout(() => {
        messageEl.style.opacity = '0';
        messageEl.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(messageEl);
        }, 300);
    }, 3000);
}

/**
 * 为按钮添加波纹点击效果
 */
function addRippleEffect() {
    const buttons = document.querySelectorAll('.login-btn, .nav-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                transform: scale(0);
                animation: ripple 0.6s linear;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// 添加波纹动画的CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// 导出供其他模块使用
window.UserManager = UserManager;
window.NavigationManager = NavigationManager;
window.userManager = userManager;
window.navigationManager = navigationManager;