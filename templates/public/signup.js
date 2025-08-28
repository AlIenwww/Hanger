// 用户注册页面完整JavaScript实现
document.addEventListener('DOMContentLoaded', function() {
    // 配置后端API基础地址
    const API_BASE_URL = 'http://127.0.0.1:8001';

    // 获取页面元素
    const registerForm = {
        email: document.querySelector('.i-phone1415-pro-max11-searchbar .M3bodylarge').parentNode,
        password: createInputContainer('password'),
        confirmPassword: createInputContainer('confirm-password'),
        submitBtn: document.querySelector('.i-phone1415-pro-max11-union'),
        backBtn: document.querySelector('.i-phone1415-pro-max11-chevronleft'),
        errorMsg: createErrorContainer(),
        successMsg: createSuccessContainer()
    };

    // 创建密码和确认密码输入容器（Figma导出可能缺少这些元素）
    function createInputContainer(id) {
        const container = document.createElement('div');
        container.id = id;
        container.className = 'i-phone1415-pro-max11-searchbar';
        container.style.marginTop = '20px';
        document.querySelector('.i-phone1415-pro-max11i-phone1415-pro-max11').appendChild(container);
        return container;
    }

    // 创建错误提示容器
    function createErrorContainer() {
        const container = document.createElement('div');
        container.id = 'register-error';
        container.style.color = '#ff3b30'; // 红色错误提示
        container.style.fontSize = '14px';
        container.style.margin = '10px 0';
        container.style.textAlign = 'center';
        container.style.minHeight = '20px';
        document.querySelector('.i-phone1415-pro-max11i-phone1415-pro-max11').appendChild(container);
        return container;
    }

    // 创建成功提示容器
    function createSuccessContainer() {
        const container = document.createElement('div');
        container.id = 'register-success';
        container.style.color = '#34c759'; // 绿色成功提示
        container.style.fontSize = '14px';
        container.style.margin = '10px 0';
        container.style.textAlign = 'center';
        container.style.display = 'none';
        document.querySelector('.i-phone1415-pro-max11i-phone1415-pro-max11').appendChild(container);
        return container;
    }

    // 将静态文本容器转换为可输入字段
    function initializeInputField(container, placeholder, isPassword = false) {
        container.innerHTML = '';
        const input = document.createElement('input');
        input.type = isPassword ? 'password' : 'email';
        input.placeholder = placeholder;
        input.className = 'M3bodylarge';
        input.style.width = '100%';
        input.style.border = 'none';
        input.style.background = 'transparent';
        input.style.outline = 'none';
        input.required = true;
        container.appendChild(input);
        return input;
    }

    // 初始化输入字段
    const emailInput = initializeInputField(registerForm.email, 'Email');
    const passwordInput = initializeInputField(registerForm.password, 'Password', true);
    const confirmPasswordInput = initializeInputField(registerForm.confirmPassword, 'Confirm Password', true);

    // 前端表单验证规则
    const validationRules = {
        email: (value) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(value) ? null : '请输入有效的邮箱地址';
        },
        password: (value) => {
            if (value.length < 6) return '密码长度至少为6位';
            if (!/[A-Z]/.test(value)) return '密码需包含至少一个大写字母';
            if (!/[0-9]/.test(value)) return '密码需包含至少一个数字';
            return null;
        },
        confirmPassword: (value) => {
            return value === passwordInput.value ? null : '两次输入的密码不一致';
        }
    };

    // 实时验证输入字段
    function validateField(field, value) {
        const error = validationRules[field](value);
        if (error) {
            registerForm.errorMsg.textContent = error;
            return false;
        }
        registerForm.errorMsg.textContent = '';
        return true;
    }

    // 绑定实时验证事件
    emailInput.addEventListener('blur', () => {
        validateField('email', emailInput.value.trim());
    });

    passwordInput.addEventListener('blur', () => {
        validateField('password', passwordInput.value);
    });

    confirmPasswordInput.addEventListener('blur', () => {
        validateField('confirmPassword', confirmPasswordInput.value);
    });

    // 全表单验证
    function validateForm() {
        const emailValid = validateField('email', emailInput.value.trim());
        const passwordValid = validateField('password', passwordInput.value);
        const confirmValid = validateField('confirmPassword', confirmPasswordInput.value);
        return emailValid && passwordValid && confirmValid;
    }

    // 安全处理用户输入（防XSS）
    function sanitizeInput(input) {
        return input
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // 提交注册数据到后端
    async function submitRegistration() {
        if (!validateForm()) return;

        // 禁用提交按钮防止重复提交
        registerForm.submitBtn.disabled = true;
        registerForm.submitBtn.style.opacity = '0.7';
        registerForm.errorMsg.textContent = '';

        try {
            // 准备请求数据
            const formData = new URLSearchParams();
            formData.append('username', sanitizeInput(emailInput.value.trim()));
            formData.append('password', passwordInput.value); // 密码不需要HTML转义

            // 发送注册请求
            const response = await fetch(`${API_BASE_URL}/register_post`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-Requested-With': 'XMLHttpRequest' // 防止CSRF
                },
                body: formData,
                credentials: 'same-origin' // 处理跨域凭证
            });

            const result = await response.json();

            if (!response.ok) {
                // 处理后端返回的错误
                throw new Error(result.detail || '注册失败，请稍后再试');
            }

            // 注册成功处理
            registerForm.successMsg.textContent = '注册成功！即将跳转到登录页...';
            registerForm.successMsg.style.display = 'block';

            // 清空表单
            emailInput.value = '';
            passwordInput.value = '';
            confirmPasswordInput.value = '';

            // 延迟跳转，让用户看到成功提示
            setTimeout(() => {
                window.location.href = 'Start.html';
            }, 2000);

        } catch (error) {
            // 显示错误信息
            registerForm.errorMsg.textContent = error.message;
        } finally {
            // 恢复按钮状态
            registerForm.submitBtn.disabled = false;
            registerForm.submitBtn.style.opacity = '1';
        }
    }

    // 绑定提交事件
    registerForm.submitBtn.addEventListener('click', submitRegistration);

    // 支持回车键提交
    confirmPasswordInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            submitRegistration();
        }
    });

    // 绑定返回按钮事件
    registerForm.backBtn.addEventListener('click', () => {
        window.location.href = 'Start.html';
    });

    // 添加表单提交默认行为阻止
    document.querySelector('.i-phone1415-pro-max11i-phone1415-pro-max11').addEventListener('submit', (e) => {
        e.preventDefault();
    });
});