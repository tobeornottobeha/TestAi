// 表单切换功能
class LoginPageManager {
    constructor() {
        this.currentForm = 'login';
        this.init();
    }

    init() {
        this.bindEvents();
        this.setFormTitle();
    }

    bindEvents() {
        // 标签按钮点击事件
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const formType = btn.getAttribute('data-form');
                this.switchForm(formType);
            });
        });

        // 表单内链接点击事件
        document.querySelectorAll('[data-form]').forEach(link => {
            if (!link.classList.contains('tab-btn')) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const formType = link.getAttribute('data-form');
                    this.switchForm(formType);
                });
            }
        });

        // 表单提交事件
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin(e);
        });

        document.getElementById('register-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister(e);
        });

        document.getElementById('forgot-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleForgotPassword(e);
        });

        // 实时密码确认验证
        document.getElementById('register-confirm-password').addEventListener('input', (e) => {
            this.validatePasswordConfirm();
        });

        document.getElementById('register-password').addEventListener('input', (e) => {
            this.validatePasswordConfirm();
        });
    }

    switchForm(formType) {
        // 更新当前表单类型
        this.currentForm = formType;

        // 更新标签按钮状态
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-form="${formType}"].tab-btn`).classList.add('active');

        // 切换表单显示
        document.querySelectorAll('.form').forEach(form => {
            form.classList.remove('active');
        });
        document.getElementById(`${formType}-form`).classList.add('active');

        // 更新标题
        this.setFormTitle();

        // 清除消息
        this.hideMessage();
    }

    setFormTitle() {
        const titles = {
            'login': '登录',
            'register': '注册',
            'forgot': '忘记密码'
        };
        document.getElementById('form-title').textContent = titles[this.currentForm];
    }

    handleLogin(e) {
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');
        const rememberMe = document.getElementById('remember-me').checked;

        // 基本验证
        if (!email || !password) {
            this.showMessage('请填写所有必填字段', 'error');
            return;
        }

        // 模拟登录请求
        this.simulateApiCall(() => {
            // 模拟成功登录
            this.showMessage(`登录成功！欢迎 ${email}`, 'success');
            
            if (rememberMe) {
                localStorage.setItem('rememberedEmail', email);
            } else {
                localStorage.removeItem('rememberedEmail');
            }

            // 在实际应用中，这里会重定向到主页面
            setTimeout(() => {
                this.showMessage('正在跳转到主页面...', 'info');
            }, 1500);
        });
    }

    handleRegister(e) {
        const formData = new FormData(e.target);
        const username = formData.get('username');
        const email = formData.get('email');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');
        const agreeTerms = document.getElementById('agree-terms').checked;

        // 验证
        if (!this.validateRegistration(username, email, password, confirmPassword, agreeTerms)) {
            return;
        }

        // 模拟注册请求
        this.simulateApiCall(() => {
            this.showMessage('注册成功！请查看邮箱激活账户', 'success');
            
            // 自动切换到登录页面
            setTimeout(() => {
                this.switchForm('login');
                // 预填邮箱
                document.getElementById('login-email').value = email;
            }, 2000);
        });
    }

    handleForgotPassword(e) {
        const formData = new FormData(e.target);
        const email = formData.get('email');

        // 验证邮箱
        if (!email || !this.isValidEmail(email)) {
            this.showMessage('请输入有效的邮箱地址', 'error');
            return;
        }

        // 模拟发送重置链接
        this.simulateApiCall(() => {
            this.showMessage('重置密码链接已发送到您的邮箱', 'success');
            
            // 自动切换到登录页面
            setTimeout(() => {
                this.switchForm('login');
            }, 2000);
        });
    }

    validateRegistration(username, email, password, confirmPassword, agreeTerms) {
        // 检查所有字段是否填写
        if (!username || !email || !password || !confirmPassword) {
            this.showMessage('请填写所有必填字段', 'error');
            return false;
        }

        // 检查用户名长度
        if (username.length < 3) {
            this.showMessage('用户名至少需要3个字符', 'error');
            return false;
        }

        // 检查邮箱格式
        if (!this.isValidEmail(email)) {
            this.showMessage('请输入有效的邮箱地址', 'error');
            return false;
        }

        // 检查密码强度
        if (password.length < 6) {
            this.showMessage('密码至少需要6个字符', 'error');
            return false;
        }

        // 检查密码确认
        if (password !== confirmPassword) {
            this.showMessage('两次输入的密码不匹配', 'error');
            return false;
        }

        // 检查是否同意条款
        if (!agreeTerms) {
            this.showMessage('请同意服务条款和隐私政策', 'error');
            return false;
        }

        return true;
    }

    validatePasswordConfirm() {
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        const confirmInput = document.getElementById('register-confirm-password');

        if (confirmPassword && password !== confirmPassword) {
            confirmInput.style.borderColor = '#e74c3c';
        } else {
            confirmInput.style.borderColor = '#e1e5e9';
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    simulateApiCall(callback) {
        // 模拟网络延迟
        this.showMessage('处理中...', 'info');
        
        setTimeout(() => {
            // 模拟90%的成功率
            if (Math.random() > 0.1) {
                callback();
            } else {
                this.showMessage('服务器错误，请稍后重试', 'error');
            }
        }, 1000 + Math.random() * 1000);
    }

    showMessage(text, type = 'info') {
        const messageEl = document.getElementById('message');
        messageEl.textContent = text;
        messageEl.className = `message ${type}`;
        
        // 显示消息
        setTimeout(() => {
            messageEl.classList.add('show');
        }, 100);

        // 3秒后自动隐藏
        setTimeout(() => {
            this.hideMessage();
        }, 3000);
    }

    hideMessage() {
        const messageEl = document.getElementById('message');
        messageEl.classList.remove('show');
    }

    // 初始化时恢复记住的邮箱
    restoreRememberedEmail() {
        const rememberedEmail = localStorage.getItem('rememberedEmail');
        if (rememberedEmail) {
            document.getElementById('login-email').value = rememberedEmail;
            document.getElementById('remember-me').checked = true;
        }
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    const loginManager = new LoginPageManager();
    loginManager.restoreRememberedEmail();
    
    // 添加一些键盘快捷键
    document.addEventListener('keydown', (e) => {
        // Escape键关闭消息
        if (e.key === 'Escape') {
            loginManager.hideMessage();
        }
        
        // Tab键切换表单 (Ctrl + 1/2/3)
        if (e.ctrlKey) {
            switch(e.key) {
                case '1':
                    e.preventDefault();
                    loginManager.switchForm('login');
                    break;
                case '2':
                    e.preventDefault();
                    loginManager.switchForm('register');
                    break;
                case '3':
                    e.preventDefault();
                    loginManager.switchForm('forgot');
                    break;
            }
        }
    });
});

// 添加一些实用功能
// 防抖函数，用于优化输入验证
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 为输入框添加动画效果
document.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('input');
    
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });
        
        // 如果输入框有值，保持focused状态
        if (input.value) {
            input.parentElement.classList.add('focused');
        }
    });
});