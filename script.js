document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('.login-form');
    const loginBtn = document.querySelector('.login-btn');
    const inputs = document.querySelectorAll('input[type="text"], input[type="password"]');
    
    // 添加输入框聚焦效果
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
    
    // 登录表单提交处理
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 添加加载状态
        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 登录中...';
        loginBtn.style.pointerEvents = 'none';
        
        // 模拟登录过程
        setTimeout(() => {
            alert('欢迎来到猿来编码！\n登录功能演示完成。');
            
            // 恢复按钮状态
            loginBtn.innerHTML = '<span>登录</span><i class="fas fa-arrow-right"></i>';
            loginBtn.style.pointerEvents = 'auto';
        }, 2000);
    });
    
    // 社交登录按钮点击处理
    document.querySelectorAll('.social-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const provider = this.classList.contains('github') ? 'GitHub' : 'Google';
            alert(`${provider} 登录功能开发中...`);
        });
    });
    
    // 添加键盘快捷键支持
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            loginForm.dispatchEvent(new Event('submit'));
        }
    });
    
    // 背景粒子效果（可选）
    createBackgroundParticles();
});

function createBackgroundParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    particlesContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
    `;
    
    document.body.appendChild(particlesContainer);
    
    // 创建浮动粒子
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            animation: float ${Math.random() * 10 + 10}s linear infinite;
        `;
        
        particlesContainer.appendChild(particle);
    }
    
    // 添加浮动动画CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0% {
                transform: translateY(100vh) translateX(0);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(-100px) translateX(${Math.random() * 200 - 100}px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}