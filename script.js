// 🎬 页面加载完成
function hideLoader() {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }
}

// 图片加载检测
function waitForImages() {
    const images = document.querySelectorAll('img');
    let loadedCount = 0;
    const totalImages = images.length;
    
    if (totalImages === 0) {
        return Promise.resolve();
    }
    
    return new Promise((resolve) => {
        let resolved = false;
        
        images.forEach((img) => {
            if (img.complete && img.naturalHeight !== 0) {
                loadedCount++;
            } else {
                img.addEventListener('load', () => {
                    loadedCount++;
                    if (loadedCount === totalImages && !resolved) {
                        resolved = true;
                        resolve();
                    }
                });
                img.addEventListener('error', () => {
                    loadedCount++;
                    if (loadedCount === totalImages && !resolved) {
                        resolved = true;
                        resolve();
                    }
                });
            }
        });
        
        // 如果所有图片都已加载完成
        if (loadedCount === totalImages && !resolved) {
            resolved = true;
            resolve();
        }
        
        // 超时保护：3秒后无论如何都继续
        setTimeout(() => {
            if (!resolved) {
                resolved = true;
                resolve();
            }
        }, 3000);
    });
}

// 使用多种方式确保加载动画消失
window.addEventListener('load', async () => {
    await waitForImages();
    setTimeout(hideLoader, 500);
    initAll();
});

// 如果load事件未触发，使用DOMContentLoaded作为备选
document.addEventListener('DOMContentLoaded', async () => {
    // 设置超时，确保即使资源加载失败也会隐藏加载动画
    setTimeout(async () => {
        await waitForImages();
        hideLoader();
        initAll();
    }, 2000);
});

function initAll() {
    try {
        initTypewriter();
        initScrollAnimations();
        initMobileMenu();
        initProfileInteraction();
        initStatsCounter();
        initCTAButton();
        initSleepSliders();
    } catch (error) {
        console.error('初始化错误:', error);
        // 即使出错也隐藏加载动画
        hideLoader();
    }
}

// 🎯 CTA按钮功能
function initCTAButton() {
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', () => {
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }
}

// 😴 睡眠滑块实时更新
function initSleepSliders() {
    const durationSlider = document.getElementById('sleepDuration');
    const qualitySlider = document.getElementById('sleepQuality');
    const durationValue = document.getElementById('durationValue');
    const qualityValue = document.getElementById('qualityValue');
    
    if (durationSlider && durationValue) {
        durationSlider.addEventListener('input', () => {
            durationValue.textContent = `${durationSlider.value}h`;
        });
    }
    
    if (qualitySlider && qualityValue) {
        qualitySlider.addEventListener('input', () => {
            qualityValue.textContent = qualitySlider.value;
        });
    }
}

// ✍️ 打字机效果
function initTypewriter() {
    const subtitle = "睡眠工程师 · 梦境架构师";
    const subtitleElement = document.getElementById('subtitle');
    if (!subtitleElement) return;
    
    let i = 0;
    const timer = setInterval(() => {
        if (i < subtitle.length) {
            subtitleElement.textContent += subtitle[i];
            i++;
        } else {
            clearInterval(timer);
        }
    }, 80);
}

// 📈 数字滚动动画
function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-number[data-target]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = +entry.target.getAttribute('data-target');
                animateNumber(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    });
    
    stats.forEach(stat => observer.observe(stat));
}

// ✅ 弹性缓动函数
function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

function animateNumber(element, target) {
    const suffix = target === 7300 ? '+' : target === 20 ? '+' : '';
    const duration = 2000;
    const startTime = performance.now();
    
    const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutCubic(progress);
        
        const current = target * eased;
        element.textContent = Math.floor(current) + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            element.textContent = target + suffix;
        }
    };
    
    requestAnimationFrame(animate);
}

// 🔄 滚动动画
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.stat-item, .service-item, .portfolio-item').forEach(el => {
        observer.observe(el);
    });
}

// 📱 移动端菜单
function initMobileMenu() {
    const btn = document.getElementById('mobileMenuBtn');
    const sidebar = document.getElementById('sidebar');
    if (!btn || !sidebar) return;
    
    btn.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });
    
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            sidebar.classList.remove('active');
        });
    });
}

// 🖱️ 头像交互
function initProfileInteraction() {
    const profileImg = document.getElementById('profileImg');
    if (!profileImg) return;
    
    // 检查图片是否加载成功
    if (profileImg.complete && profileImg.naturalHeight !== 0) {
        setupProfileInteraction(profileImg);
    } else {
        // 等待图片加载
        profileImg.addEventListener('load', () => {
            setupProfileInteraction(profileImg);
        });
        
        // 如果图片加载失败，设置超时处理
        profileImg.addEventListener('error', () => {
            console.warn('头像图片加载失败，跳过交互效果');
            // 可以在这里设置一个默认占位符
            if (profileImg.style.display === 'none') {
                profileImg.parentElement.style.display = 'none';
            }
        });
        
        // 超时保护：5秒后如果还没加载完成，就跳过交互设置
        setTimeout(() => {
            if (profileImg.complete && profileImg.naturalHeight !== 0) {
                setupProfileInteraction(profileImg);
            }
        }, 5000);
    }
}

function setupProfileInteraction(profileImg) {
    if (!profileImg || profileImg.style.display === 'none') return;
    
    profileImg.addEventListener('click', () => {
        profileImg.style.transform = 'scale(1.1) rotate(5deg)';
        setTimeout(() => {
            profileImg.style.transform = 'scale(1) rotate(0deg)';
        }, 300);
    });
    
    // 鼠标跟随光效
    document.addEventListener('mousemove', (e) => {
        if (profileImg.style.display === 'none') return;
        
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        const intensity = 0.3 + (x + y) * 0.2;
        
        profileImg.style.boxShadow = `
            ${(x - 0.5) * 20}px ${(y - 0.5) * 20}px 30px rgba(0, 0, 0, 0.5),
            0 0 30px rgba(99, 102, 241, ${intensity})
        `;
    });
}

// 🎯 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// 😴 睡眠模式：页面闲置3分钟后进入"睡眠模式"
let sleepTimer;
function resetSleepTimer() {
    clearTimeout(sleepTimer);
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        heroTitle.innerHTML = '<span class="title-line">DEEP SLEEPER</span><span class="title-line highlight">SLEEP ENGINEER</span>';
    }
    document.body.style.filter = '';
    
    sleepTimer = setTimeout(() => {
        document.body.style.filter = 'blur(2px) brightness(0.5)';
        if (heroTitle) {
            heroTitle.innerHTML = '<span class="title-line highlight">Zzz...</span>';
        }
    }, 180000); // 3分钟
}

document.addEventListener('mousemove', resetSleepTimer);
document.addEventListener('keypress', resetSleepTimer);
document.addEventListener('scroll', resetSleepTimer);
resetSleepTimer(); // 初始化

// 📊 睡眠指数显示
function updateSleepIndex() {
    const sleepIndexEl = document.querySelector('.sleep-index');
    if (!sleepIndexEl) return;
    
    const now = new Date();
    const hour = now.getHours();
    let sleepIndex;
    
    if (hour >= 22 || hour <= 6) {
        sleepIndex = "深度睡眠黄金期";
    } else if (hour >= 13 && hour <= 14) {
        sleepIndex = "午休能量补给站";
    } else {
        sleepIndex = "清醒状态";
    }
    
    sleepIndexEl.textContent = `此刻：${sleepIndex}`;
}

// 初始化睡眠指数
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        updateSleepIndex();
        setInterval(updateSleepIndex, 60000);
    });
} else {
    updateSleepIndex();
    setInterval(updateSleepIndex, 60000);
}

// 😴 AI睡眠质量分析功能
function initAISleepAnalysis() {
    const aiAnalysisBtn = document.getElementById('aiAnalysisBtn');
    if (!aiAnalysisBtn) return;
    
    aiAnalysisBtn.addEventListener('click', () => {
        performAISleepAnalysis();
    });
}

// 执行AI睡眠质量分析
async function performAISleepAnalysis() {
    const aiAnalysisBtn = document.getElementById('aiAnalysisBtn');
    const aiAnalysisResult = document.getElementById('aiAnalysisResult');
    const aiScore = document.getElementById('aiScore');
    const aiGrade = document.getElementById('aiGrade');
    const aiEvaluation = document.getElementById('aiEvaluation');
    const aiInsights = document.getElementById('aiInsights');
    const aiSuggestions = document.getElementById('aiSuggestions');
    
    if (!aiAnalysisBtn || !aiAnalysisResult || !aiScore || !aiGrade || !aiEvaluation || !aiInsights || !aiSuggestions) {
        console.error('AI分析相关元素未找到');
        return;
    }
    
    // 显示加载状态
    aiAnalysisBtn.disabled = true;
    aiAnalysisBtn.innerHTML = '<span>分析中...</span><span>⏳</span>';
    
    try {
        // 模拟AI分析过程
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // 收集睡眠数据
        const sleepData = {
            duration: parseFloat(document.getElementById('sleepDuration').value) || 7.0,
            quality: parseInt(document.getElementById('sleepQuality').value) || 7,
            notes: document.getElementById('sleepNotes').value || ''
        };
        
        // 生成AI分析结果
        const analysisResult = generateAIAnalysisResult(sleepData);
        
        // 更新UI显示分析结果
        aiScore.textContent = analysisResult.score;
        aiGrade.textContent = analysisResult.grade;
        aiEvaluation.textContent = analysisResult.evaluation;
        
        // 清空并更新睡眠洞察
        aiInsights.innerHTML = '';
        analysisResult.insights.forEach(insight => {
            const li = document.createElement('li');
            li.textContent = insight;
            aiInsights.appendChild(li);
        });
        
        // 清空并更新个性化建议
        aiSuggestions.innerHTML = '';
        analysisResult.suggestions.forEach(suggestion => {
            const li = document.createElement('li');
            li.textContent = suggestion;
            aiSuggestions.appendChild(li);
        });
        
        // 显示分析结果
        aiAnalysisResult.style.display = 'block';
        
        // 滚动到分析结果区域
        aiAnalysisResult.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
    } catch (error) {
        console.error('AI分析失败:', error);
        alert('AI分析失败，请稍后重试');
    } finally {
        // 恢复按钮状态
        aiAnalysisBtn.disabled = false;
        aiAnalysisBtn.innerHTML = '<span>AI智能分析</span>';
    }
}

// 生成AI分析结果
function generateAIAnalysisResult(sleepData) {
    const { duration, quality, notes } = sleepData;
    let score = Math.round((duration * 10 + quality * 5) / 2);
    score = Math.max(0, Math.min(100, score));
    
    let grade;
    if (score >= 90) grade = '优秀';
    else if (score >= 80) grade = '良好';
    else if (score >= 70) grade = '一般';
    else if (score >= 60) grade = '及格';
    else grade = '需要改善';
    
    let evaluation;
    if (score >= 90) {
        evaluation = '🎉 您的睡眠质量非常优秀！您的睡眠时间充足，睡眠质量良好，这对您的身心健康非常有益。继续保持这样的睡眠习惯！';
    } else if (score >= 80) {
        evaluation = '✅ 您的睡眠质量良好，睡眠时间基本充足。建议您继续保持规律的作息时间，进一步提高睡眠质量。';
    } else if (score >= 70) {
        evaluation = '💡 您的睡眠质量一般，可能需要调整作息时间或改善睡眠环境。建议您保持规律的睡眠时间，避免睡前使用电子设备。';
    } else if (score >= 60) {
        evaluation = '⚠️ 您的睡眠质量不太理想，睡眠时间不足或质量较差。建议您调整作息时间，改善睡眠环境，必要时咨询专业医生。';
    } else {
        evaluation = '❗ 您的睡眠质量需要严重改善。长期睡眠不足或质量差会影响身心健康，建议您尽快调整生活习惯，必要时寻求专业帮助。';
    }
    
    const insights = [];
    if (duration < 7) {
        insights.push('您的睡眠时间不足7小时，长期睡眠不足会影响免疫力和认知功能。');
    } else if (duration > 9) {
        insights.push('您的睡眠时间超过9小时，过长的睡眠可能会导致身体乏力。');
    } else {
        insights.push('您的睡眠时间在理想范围内（7-9小时），这对身体健康非常有益。');
    }
    
    if (quality < 6) {
        insights.push('您的睡眠质量评分较低，可能存在入睡困难、多梦或易醒等问题。');
    } else if (quality > 8) {
        insights.push('您的睡眠质量评分很高，说明您的睡眠深度和连续性都很好。');
    } else {
        insights.push('您的睡眠质量评分中等，还有提升空间。');
    }
    
    if (notes.includes('梦')) {
        insights.push('您提到了做梦，适当的梦境是正常的，但频繁的噩梦可能会影响睡眠质量。');
    }
    
    if (notes.includes('醒')) {
        insights.push('您提到了夜间醒来，这可能是由于睡眠环境不佳或身体不适导致的。');
    }
    
    const suggestions = [];
    if (duration < 7) {
        suggestions.push('建议您每天保证7-9小时的睡眠时间，尽量在固定时间上床睡觉和起床。');
    } else if (duration > 9) {
        suggestions.push('建议您适当减少睡眠时间，避免过度睡眠导致的身体乏力。');
    }
    
    if (quality < 8) {
        suggestions.push('建议您改善睡眠环境，保持卧室安静、黑暗和凉爽，使用舒适的床垫和枕头。');
        suggestions.push('睡前避免使用电子设备，尤其是手机和平板电脑，因为蓝光会抑制褪黑素的分泌。');
        suggestions.push('睡前可以尝试进行放松活动，如阅读、听轻音乐或冥想，帮助您更快入睡。');
    }
    
    suggestions.push('建议您保持规律的运动习惯，但避免在睡前2-3小时内进行剧烈运动。');
    suggestions.push('避免在睡前饮用咖啡、茶或含酒精的饮料，这些会影响睡眠质量。');
    suggestions.push('建议您记录睡眠日记，跟踪睡眠质量和影响因素，以便更好地调整睡眠习惯。');
    
    return {
        score,
        grade,
        evaluation,
        insights,
        suggestions
    };
}

// AI睡眠分析功能初始化
function initAISleepAnalysis() {
    const aiAnalysisBtn = document.getElementById('aiAnalysisBtn');
    if (!aiAnalysisBtn) return;
    
    aiAnalysisBtn.addEventListener('click', performAISleepAnalysis);
}

// 初始化睡眠滑块功能（添加CSS变量支持）
function initSleepSliders() {
    const durationSlider = document.getElementById('sleepDuration');
    const qualitySlider = document.getElementById('sleepQuality');
    const durationValue = document.getElementById('durationValue');
    const qualityValue = document.getElementById('qualityValue');
    
    if (durationSlider && durationValue) {
        durationSlider.addEventListener('input', () => {
            durationValue.textContent = `${durationSlider.value}h`;
            // 更新CSS变量，实现滑块渐变效果
            durationSlider.style.setProperty('--value', durationSlider.value);
        });
        // 初始化CSS变量
        durationSlider.style.setProperty('--value', durationSlider.value);
        durationSlider.style.setProperty('--min', durationSlider.min || 0);
        durationSlider.style.setProperty('--max', durationSlider.max || 12);
    }
    
    if (qualitySlider && qualityValue) {
        qualitySlider.addEventListener('input', () => {
            qualityValue.textContent = qualitySlider.value;
            // 更新CSS变量，实现滑块渐变效果
            qualitySlider.style.setProperty('--value', qualitySlider.value);
        });
        // 初始化CSS变量
        qualitySlider.style.setProperty('--value', qualitySlider.value);
        qualitySlider.style.setProperty('--min', qualitySlider.min || 1);
        qualitySlider.style.setProperty('--max', qualitySlider.max || 10);
    }
}

// 初始化留言板功能
function initGuestbook() {
    const guestbookForm = document.getElementById('guestbookForm');
    if (!guestbookForm) return;
    
    // 加载留言
    loadGuestbookMessages();
    
    // 设置实时订阅
    setupRealtimeSubscription();
    
    guestbookForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const guestName = document.getElementById('guestName').value;
        const guestMessage = document.getElementById('guestMessage').value;
        
        if (!guestName || !guestMessage) {
            alert('请填写昵称和留言内容');
            return;
        }
        
        // 显示加载状态
        const submitBtn = guestbookForm.querySelector('.form-button');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>提交中...</span><span>⏳</span>';
        submitBtn.disabled = true;
        
        try {
            // 保存留言到Supabase
            const { error } = await supabase
                .from('guestbook')
                .insert([
                    {
                        name: guestName,
                        message: guestMessage,
                        status: 'active',
                        created_at: new Date().toISOString()
                    }
                ]);
            
            if (error) {
                throw error;
            }
            
            // 清空表单
            guestbookForm.reset();
            
            // 显示成功提示
            alert('留言成功！感谢您的分享。');
        } catch (error) {
            console.error('提交留言失败:', error);
            alert('提交留言失败，请稍后重试');
        } finally {
            // 恢复按钮状态
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// 从Supabase加载留言
async function loadGuestbookMessages() {
    const guestbookMessages = document.getElementById('guestbookMessages');
    if (!guestbookMessages) return;
    
    // 显示加载状态
    guestbookMessages.innerHTML = '<div style="text-align: center; padding: 40px;"><div class="loading loading-spinner loading-lg text-primary"></div><p class="mt-4 text-sm opacity-70">加载留言中...</p></div>';
    
    try {
        // 从Supabase获取留言
        const { data, error } = await supabase
            .from('guestbook')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) {
            throw error;
        }
        
        // 清空留言列表
        guestbookMessages.innerHTML = '';
        
        // 渲染留言
        if (data && data.length > 0) {
            data.forEach(message => {
                const messageElement = createMessageElement(message);
                guestbookMessages.appendChild(messageElement);
            });
        } else {
            guestbookMessages.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--color-text-muted);">暂无留言，快来发表第一条留言吧！</div>';
        }
    } catch (error) {
        console.error('加载留言失败:', error);
        guestbookMessages.innerHTML = '<div style="text-align: center; padding: 40px; color: #ef4444;">加载留言失败，请稍后重试</div>';
    }
}

// 创建留言元素
function createMessageElement(message, isReply = false) {
    const newMessage = document.createElement('div');
    newMessage.className = `guestbook-message ${isReply ? 'guestbook-reply' : ''}`;
    newMessage.dataset.id = message.id;
    if (message.parent_id) {
        newMessage.dataset.parentId = message.parent_id;
    }
    
    // 格式化时间
    const createdAt = new Date(message.created_at);
    const formattedTime = createdAt.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    newMessage.innerHTML = `
        <div class="guestbook-message-header">
            <div class="guestbook-message-name">${message.name}</div>
            <div class="guestbook-message-time">${formattedTime}</div>
        </div>
        <div class="guestbook-message-content">${message.message}</div>
        <div class="guestbook-message-actions">
            <button class="like-btn" onclick="likeMessage('${message.id}', this)" title="点赞这条留言">
                <span class="like-icon">❤️</span>
                <span class="like-count">${message.likes || 0}</span>
            </button>
            <button class="reply-btn" onclick="toggleReplyForm('${message.id}', this)" title="回复这条留言">
                <span class="reply-icon">💬</span>
                <span class="reply-count">${message.reply_count || 0}</span>
            </button>
        </div>
        
        <!-- 回复表单 -->
        <div class="reply-form-container" id="reply-form-${message.id}">
            <div class="reply-form">
                <div class="reply-form-header">
                    <h4>回复留言</h4>
                    <button class="close-reply-btn" onclick="toggleReplyForm('${message.id}', this)">×</button>
                </div>
                <form onsubmit="submitReply(event, '${message.id}')" class="reply-submit-form">
                    <input type="text" id="reply-name-${message.id}" placeholder="您的昵称" required>
                    <textarea id="reply-message-${message.id}" placeholder="您的回复内容" required rows="3"></textarea>
                    <button type="submit" class="form-button reply-submit-btn">
                        <span>发送回复</span>
                        <span>✉️</span>
                    </button>
                </form>
            </div>
        </div>
        
        <!-- 回复列表 -->
        <div class="reply-list" id="reply-list-${message.id}"></div>
    `;
    
    return newMessage;
}

// 刷新留言
async function refreshGuestbook() {
    await loadGuestbookMessages();
}

// 设置实时订阅
function setupRealtimeSubscription() {
    // 监听guestbook表的变化
    const subscription = supabase
        .channel('guestbook-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'guestbook' }, (payload) => {
            // 当有新留言或留言更新时，重新加载留言列表
            loadGuestbookMessages();
        })
        .subscribe();
    
    // 保存订阅以便后续可以取消
    window.guestbookSubscription = subscription;
}

// 过滤留言
function filterMessages(filterType) {
    // 这里可以根据需要实现留言过滤功能
    console.log('过滤留言:', filterType);
}

// 点赞留言
async function likeMessage(messageId, button) {
    if (!messageId) return;
    
    // 防止重复点赞
    if (button.classList.contains('liked')) {
        return;
    }
    
    // 获取元素
    const likeIcon = button.querySelector('.like-icon');
    const likeCount = button.querySelector('.like-count');
    
    // 初始状态
    const initialLikes = parseInt(likeCount.textContent) || 0;
    let newLikes = initialLikes + 1;
    
    // 添加点赞状态
    button.classList.add('liked', 'like-animating');
    
    // 立即更新UI（乐观更新）
    likeIcon.style.animation = 'heart-beat 0.8s ease-in-out';
    likeCount.style.animation = 'count-grow 0.6s ease-out';
    
    // 创建心形粒子效果
    createHeartParticles(button);
    
    // 平滑增长动画
    let currentCount = initialLikes;
    const countInterval = setInterval(() => {
        if (currentCount < newLikes) {
            currentCount++;
            likeCount.textContent = currentCount;
        } else {
            clearInterval(countInterval);
        }
    }, 50);
    
    try {
        // 更新Supabase中的点赞数
        const { data: currentMessage, error: fetchError } = await supabase
            .from('guestbook')
            .select('likes')
            .eq('id', messageId)
            .single();
        
        if (fetchError) throw fetchError;
        
        // 获取最新点赞数并重新计算
        const actualLikes = (currentMessage.likes || 0) + 1;
        newLikes = actualLikes;
        
        const { error: updateError } = await supabase
            .from('guestbook')
            .update({ likes: actualLikes })
            .eq('id', messageId);
        
        if (updateError) throw updateError;
        
        // 确保最终显示正确的点赞数
        likeCount.textContent = actualLikes;
        
        console.log('留言点赞成功:', messageId);
        
    } catch (error) {
        console.error('点赞失败:', error);
        
        // 回滚UI变化
        button.classList.remove('liked');
        newLikes = initialLikes;
        likeCount.textContent = initialLikes;
        
        // 显示错误提示
        showErrorTooltip(button, '点赞失败，请重试');
    } finally {
        // 清理动画
        setTimeout(() => {
            button.classList.remove('like-animating');
            likeIcon.style.animation = '';
            likeCount.style.animation = '';
        }, 800);
        
        // 确保清除计数间隔
        clearInterval(countInterval);
        likeCount.textContent = newLikes;
    }
}

// 显示错误提示
function showErrorTooltip(element, message) {
    const tooltip = document.createElement('div');
    tooltip.textContent = message;
    tooltip.style.cssText = `
        position: absolute;
        top: -35px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #ef4444, #dc2626);
        color: white;
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 500;
        white-space: nowrap;
        z-index: 1000;
        animation: tooltip-fade-in 0.3s ease-out, tooltip-fade-out 0.3s ease-in 2s forwards;
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
    `;
    
    element.style.position = 'relative';
    element.appendChild(tooltip);
    
    setTimeout(() => tooltip.remove(), 2300);
}

// 创建心形粒子效果
function createHeartParticles(button) {
    const particles = 8;
    const buttonRect = button.getBoundingClientRect();
    const centerX = buttonRect.width / 2;
    const centerY = buttonRect.height / 2;
    
    for (let i = 0; i < particles; i++) {
        const particle = document.createElement('div');
        particle.textContent = '❤️';
        particle.style.cssText = `
            position: absolute;
            font-size: 16px;
            pointer-events: none;
            z-index: 1000;
            left: ${centerX}px;
            top: ${centerY}px;
        `;
        
        button.appendChild(particle);
        
        // 随机方向和距离
        const angle = (i / particles) * Math.PI * 2;
        const distance = 50 + Math.random() * 30;
        const duration = 800 + Math.random() * 400;
        
        // 动画
        particle.animate([
            {
                transform: 'translate(-50%, -50%) scale(1)',
                opacity: 1
            },
            {
                transform: `translate(${Math.cos(angle) * distance - 50}%, ${Math.sin(angle) * distance - 50}%) scale(0)`,
                opacity: 0
            }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
        }).onfinish = () => particle.remove();
    }
}

// 切换回复表单显示
function toggleReplyForm(messageId, button) {
    const replyForm = document.getElementById(`reply-form-${messageId}`);
    
    if (!replyForm) return;
    
    // 切换表单显示状态
    const isVisible = replyForm.style.display === 'block';
    
    if (isVisible) {
        // 隐藏表单，使用淡出动画
        replyForm.style.animation = 'reply-form-fade-out 0.3s ease-out forwards';
        setTimeout(() => {
            replyForm.style.display = 'none';
            replyForm.style.animation = '';
        }, 300);
    } else {
        // 显示表单，使用淡入动画
        replyForm.style.display = 'block';
        replyForm.style.animation = 'reply-form-fade-in 0.3s ease-out forwards';
        
        // 自动聚焦到第一个输入框
        const nameInput = document.getElementById(`reply-name-${messageId}`);
        if (nameInput) {
            nameInput.focus();
        }
        
        // 加载该留言的回复
        loadReplies(messageId);
    }
}

// 提交回复
async function submitReply(event, messageId) {
    event.preventDefault();
    
    const replyForm = event.target;
    const nameInput = document.getElementById(`reply-name-${messageId}`);
    const messageInput = document.getElementById(`reply-message-${messageId}`);
    const submitBtn = replyForm.querySelector('.reply-submit-btn');
    
    const name = nameInput.value.trim();
    const message = messageInput.value.trim();
    
    if (!name || !message) {
        alert('请填写昵称和回复内容');
        return;
    }
    
    // 显示加载状态
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>发送中...</span><span>⏳</span>';
    submitBtn.disabled = true;
    
    try {
        // 保存回复到Supabase
        const { error } = await supabase
            .from('guestbook')
            .insert([
                {
                    name: name,
                    message: message,
                    status: 'active',
                    parent_id: messageId,
                    created_at: new Date().toISOString()
                }
            ]);
        
        if (error) {
            throw error;
        }
        
        // 清空表单
        replyForm.reset();
        
        // 显示成功提示
        const successMsg = document.createElement('div');
        successMsg.className = 'reply-success';
        successMsg.textContent = '回复成功！';
        replyForm.appendChild(successMsg);
        
        // 3秒后移除成功提示
        setTimeout(() => {
            successMsg.style.animation = 'reply-success-fade-out 0.3s ease-out forwards';
            setTimeout(() => successMsg.remove(), 300);
        }, 3000);
        
        // 重新加载该留言的回复
        loadReplies(messageId);
        
        // 更新原留言的回复计数
        updateReplyCount(messageId);
        
    } catch (error) {
        console.error('提交回复失败:', error);
        alert('提交回复失败，请稍后重试');
    } finally {
        // 恢复按钮状态
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// 加载回复
async function loadReplies(messageId) {
    const replyList = document.getElementById(`reply-list-${messageId}`);
    if (!replyList) return;
    
    // 显示加载状态
    replyList.innerHTML = '<div class="reply-loading">加载回复中...</div>';
    
    try {
        // 从Supabase获取回复
        const { data, error } = await supabase
            .from('guestbook')
            .select('*')
            .eq('parent_id', messageId)
            .eq('status', 'active')
            .order('created_at', { ascending: true });
        
        if (error) throw error;
        
        // 清空回复列表
        replyList.innerHTML = '';
        
        // 渲染回复
        if (data && data.length > 0) {
            data.forEach(reply => {
                const replyElement = createMessageElement(reply, true);
                replyList.appendChild(replyElement);
                
                // 添加回复进入动画
                replyElement.style.animation = 'reply-slide-in 0.4s ease-out forwards';
            });
        } else {
            replyList.innerHTML = '<div class="no-replies">暂无回复，快来发表第一条回复吧！</div>';
        }
        
    } catch (error) {
        console.error('加载回复失败:', error);
        replyList.innerHTML = '<div class="reply-error">加载回复失败，请稍后重试</div>';
    }
}

// 更新回复计数
async function updateReplyCount(messageId) {
    try {
        // 获取该留言的回复数量
        const { data, error } = await supabase
            .from('guestbook')
            .select('id')
            .eq('parent_id', messageId)
            .eq('status', 'active');
        
        if (error) throw error;
        
        const replyCount = data ? data.length : 0;
        
        // 更新原留言的回复计数
        const messageElement = document.querySelector(`[data-id="${messageId}"]`);
        if (messageElement) {
            const replyCountElement = messageElement.querySelector('.reply-count');
            if (replyCountElement) {
                // 添加计数增长动画
                replyCountElement.style.animation = 'count-grow 0.6s ease-out';
                replyCountElement.textContent = replyCount;
                
                setTimeout(() => {
                    replyCountElement.style.animation = '';
                }, 600);
            }
        }
        
    } catch (error) {
        console.error('更新回复计数失败:', error);
    }
}

// 初始化所有功能
function initAll() {
    try {
        initTypewriter();
        initScrollAnimations();
        initMobileMenu();
        initProfileInteraction();
        initStatsCounter();
        initCTAButton();
        initSleepSliders();
        initAISleepAnalysis();
        initGuestbook();
    } catch (error) {
        console.error('初始化错误:', error);
        // 即使出错也隐藏加载动画
        hideLoader();
    }
}

// ✨ 华丽按钮交互系统
function initButtonAnimations() {
    // 为所有按钮添加点击波纹效果
    const buttons = document.querySelectorAll('.cta-button, .form-button, .refresh-btn, .filter-btn, .ai-analysis-btn, .mobile-menu-btn');
    
    buttons.forEach(button => {
        // 添加鼠标进入效果
        button.addEventListener('mouseenter', function() {
            this.style.transform = this.style.transform.replace('scale(0.98)', '') + ' scale(1.02)';
        });
        
        // 添加鼠标离开效果
        button.addEventListener('mouseleave', function() {
            this.style.transform = this.style.transform.replace('scale(1.02)', '') + ' scale(1)';
        });
        
        // 添加点击波纹效果
        button.addEventListener('click', function(e) {
            // 创建波纹效果
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
                z-index: 1;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
            
            // 添加点击缩放效果
            this.style.transform = this.style.transform.replace('scale(1.02)', '') + ' scale(0.98)';
            setTimeout(() => {
                this.style.transform = this.style.transform.replace('scale(0.98)', '') + ' scale(1.02)';
            }, 100);
        });
        
        // 添加键盘焦点效果
        button.addEventListener('focus', function() {
            this.style.outline = '2px solid var(--color-accent)';
            this.style.outlineOffset = '2px';
        });
        
        button.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    });
    
    // 为表单按钮添加特殊加载动画
    const formButtons = document.querySelectorAll('.form-button, .ai-analysis-btn');
    formButtons.forEach(button => {
        const originalText = button.innerHTML;
        
        // 添加加载状态函数
        button.setLoadingState = function(loading) {
            if (loading) {
                this.classList.add('button-loading');
                this.innerHTML = '<span style="opacity: 0.7;">处理中...</span>';
                this.disabled = true;
            } else {
                this.classList.remove('button-loading');
                this.innerHTML = originalText;
                this.disabled = false;
            }
        };
    });
    
    // 为筛选按钮添加切换动画
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 移除其他按钮的active状态
            filterButtons.forEach(btn => {
                if (btn !== this) {
                    btn.classList.remove('active');
                }
            });
            
            // 添加切换动画
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
            }, 100);
        });
    });
    
    // 为刷新按钮添加特殊旋转动画
    const refreshBtn = document.querySelector('.refresh-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            this.style.animation = 'none';
            setTimeout(() => {
                this.style.animation = 'spin 0.8s ease-in-out';
            }, 10);
        });
    }
    
    // 为移动端菜单按钮添加特殊动画
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    if (mobileMenuBtn) {
        const spans = mobileMenuBtn.querySelectorAll('span');
        let isOpen = false;
        
        mobileMenuBtn.addEventListener('click', function() {
            isOpen = !isOpen;
            
            if (isOpen) {
                spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
                spans[1].style.opacity = '0';
                spans[1].style.transform = 'scale(0)';
                spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[1].style.transform = 'scale(1)';
                spans[2].style.transform = 'none';
            }
        });
    }
    
    // 添加按钮悬停音效（可选）
    const addHoverSound = () => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        buttons.forEach(button => {
            button.addEventListener('mouseenter', function() {
                if (audioContext) {
                    const oscillator = audioContext.createOscillator();
                    const gainNode = audioContext.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(audioContext.destination);
                    
                    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
                    
                    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                    
                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 0.1);
                }
            });
        });
    };
    
    // 初始化音效（需要用户交互才能播放）
    document.addEventListener('click', function initAudio() {
        addHoverSound();
        document.removeEventListener('click', initAudio);
    }, { once: true });
    
    console.log('✨ 华丽按钮动画系统已初始化');
}

// 在页面加载完成后初始化AI分析功能
document.addEventListener('DOMContentLoaded', initAISleepAnalysis);
document.addEventListener('DOMContentLoaded', initButtonAnimations);