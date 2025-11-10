// 插件功能实现
document.addEventListener('DOMContentLoaded', function() {
    // 调整窗口尺寸
    if (window.innerWidth < 600 || window.innerHeight < 700) {
        window.resizeTo(600, 700);
    }
    
    // 获取DOM元素
    const toggleModeBtn = document.getElementById('toggleMode');
    const increaseFontBtn = document.getElementById('increaseFont');
    const decreaseFontBtn = document.getElementById('decreaseFont');
    const countBtn = document.getElementById('countBtn');
    const countValue = document.getElementById('countValue');
    const content = document.getElementById('content');
    const body = document.body;

    // 字体大小控制
    let currentFontSize = 16;
    const minFontSize = 12;
    const maxFontSize = 24;

    // 计数功能
    let count = 0;

    // 初始化
    loadSettings();
    loadCount();

    // 切换阅读模式
    toggleModeBtn.addEventListener('click', function() {
        body.classList.toggle('reading-mode');
        const isReadingMode = body.classList.contains('reading-mode');
        
        if (isReadingMode) {
            toggleModeBtn.textContent = '普通模式';
            toggleModeBtn.classList.remove('btn-secondary');
            toggleModeBtn.classList.add('btn');
        } else {
            toggleModeBtn.textContent = '阅读模式';
            toggleModeBtn.classList.remove('btn');
            toggleModeBtn.classList.add('btn-secondary');
        }
        
        saveSettings();
    });

    // 增大字体
    increaseFontBtn.addEventListener('click', function() {
        if (currentFontSize < maxFontSize) {
            currentFontSize += 2;
            updateFontSize();
        }
    });

    // 减小字体
    decreaseFontBtn.addEventListener('click', function() {
        if (currentFontSize > minFontSize) {
            currentFontSize -= 2;
            updateFontSize();
        }
    });

    // 计数按钮点击事件
    countBtn.addEventListener('click', function() {
        incrementCount();
    });

    // 增加计数
    function incrementCount() {
        count++;
        updateCountDisplay();
        saveCount();
        
        // 添加按钮动画效果
        countBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            countBtn.style.transform = '';
        }, 150);
        
        // 添加计数显示动画
        countValue.style.transform = 'scale(1.2)';
        countValue.style.color = '#e74c3c';
        setTimeout(() => {
            countValue.style.transform = '';
            countValue.style.color = '#fff';
        }, 300);
    }

    // 更新计数显示
    function updateCountDisplay() {
        countValue.textContent = count;
    }

    // 保存计数到本地存储
    function saveCount() {
        chrome.storage.local.set({ 'qingjingjing_count': count }, function() {
            console.log('计数已保存:', count);
        });
    }

    // 加载计数
    function loadCount() {
        chrome.storage.local.get(['qingjingjing_count'], function(result) {
            count = result.qingjingjing_count || 0;
            updateCountDisplay();
        });
    }

    // 更新字体大小
    function updateFontSize() {
        const textContents = document.querySelectorAll('.text-content');
        textContents.forEach(content => {
            content.style.fontSize = currentFontSize + 'px';
        });
        
        // 更新字体大小类
        body.classList.remove('font-small', 'font-medium', 'font-large', 'font-extra-large');
        
        if (currentFontSize <= 14) {
            body.classList.add('font-small');
        } else if (currentFontSize <= 16) {
            body.classList.add('font-medium');
        } else if (currentFontSize <= 18) {
            body.classList.add('font-large');
        } else {
            body.classList.add('font-extra-large');
        }
        
        saveSettings();
    }

    // 保存设置到本地存储
    function saveSettings() {
        const settings = {
            fontSize: currentFontSize,
            isReadingMode: body.classList.contains('reading-mode')
        };
        
        chrome.storage.local.set({ 'qingjingjing_settings': settings }, function() {
            console.log('设置已保存');
        });
    }

    // 加载设置
    function loadSettings() {
        chrome.storage.local.get(['qingjingjing_settings'], function(result) {
            const settings = result.qingjingjing_settings;
            
            if (settings) {
                // 恢复字体大小
                currentFontSize = settings.fontSize || 16;
                updateFontSize();
                
                // 恢复阅读模式
                if (settings.isReadingMode) {
                    body.classList.add('reading-mode');
                    toggleModeBtn.textContent = '普通模式';
                    toggleModeBtn.classList.remove('btn-secondary');
                    toggleModeBtn.classList.add('btn');
                }
            } else {
                // 默认字体大小
                updateFontSize();
            }
        });
    }

    // 添加键盘快捷键支持
    document.addEventListener('keydown', function(event) {
        // Ctrl/Cmd + 加号：增大字体
        if ((event.ctrlKey || event.metaKey) && event.key === '=') {
            event.preventDefault();
            increaseFontBtn.click();
        }
        
        // Ctrl/Cmd + 减号：减小字体
        if ((event.ctrlKey || event.metaKey) && event.key === '-') {
            event.preventDefault();
            decreaseFontBtn.click();
        }
        
        // Ctrl/Cmd + 0：重置字体
        if ((event.ctrlKey || event.metaKey) && event.key === '0') {
            event.preventDefault();
            currentFontSize = 16;
            updateFontSize();
        }
        
        // R键：切换阅读模式
        if (event.key === 'r' || event.key === 'R') {
            if (!event.ctrlKey && !event.metaKey) {
                event.preventDefault();
                toggleModeBtn.click();
            }
        }
    });

    // 添加平滑滚动效果
    const sections = document.querySelectorAll('.section');
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // 添加段落点击效果
    const paragraphs = document.querySelectorAll('.text-content p');
    paragraphs.forEach(p => {
        p.addEventListener('click', function() {
            // 添加短暂的高亮效果
            this.style.background = 'rgba(52, 152, 219, 0.2)';
            this.style.transform = 'translateX(10px)';
            
            setTimeout(() => {
                this.style.background = '';
                this.style.transform = '';
            }, 300);
        });
    });

    // 工具提示功能
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.style.cssText = `
        position: absolute;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 5px 10px;
        border-radius: 4px;
        font-size: 12px;
        pointer-events: none;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s;
    `;
    document.body.appendChild(tooltip);

    // 为按钮添加工具提示
    const buttons = [toggleModeBtn, increaseFontBtn, decreaseFontBtn, countBtn];
    const tooltips = ['切换阅读模式 (R键)', '增大字体 (Ctrl/Cmd + +)', '减小字体 (Ctrl/Cmd + -)', '增加计数'];

    buttons.forEach((btn, index) => {
        btn.addEventListener('mouseenter', function(e) {
            tooltip.textContent = tooltips[index];
            tooltip.style.opacity = '1';
            updateTooltipPosition(e);
        });

        btn.addEventListener('mousemove', function(e) {
            updateTooltipPosition(e);
        });

        btn.addEventListener('mouseleave', function() {
            tooltip.style.opacity = '0';
        });
    });

    function updateTooltipPosition(e) {
        tooltip.style.left = e.pageX + 10 + 'px';
        tooltip.style.top = e.pageY - 30 + 'px';
    }

    console.log('太上老君说常清静经插件已加载');
    console.log('快捷键：R - 切换阅读模式，Ctrl/Cmd +/- - 调整字体，Ctrl/Cmd + 0 - 重置字体');
});