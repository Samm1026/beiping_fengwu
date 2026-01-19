// 路线策展页面交互脚本

// DOM元素
const categoryBtns = document.querySelectorAll('.category-btn');
const routeCards = document.querySelectorAll('.route-card');
const hotspotModal = document.getElementById('hotspot-modal');
const hotspotContent = document.getElementById('hotspot-content');
const closeHotspot = document.getElementById('close-hotspot');
const shareBtn = document.getElementById('share-btn');

// 初始化函数
function init() {
    setupCategoryFilter();
    setupHotspots();
    setupShare();
    setupRandomTasks();
}

// 分类筛选功能
function setupCategoryFilter() {
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;
            
            // 更新按钮状态
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // 筛选路线卡片
            routeCards.forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// 热点交互功能
function setupHotspots() {
    const hotspots = document.querySelectorAll('.hotspot');
    
    hotspots.forEach(hotspot => {
        hotspot.addEventListener('click', () => {
            const hotspotId = hotspot.dataset.hotspot;
            const data = routeHotspotData[hotspotId];
            
            if (data) {
                hotspotContent.innerHTML = `<h3>${data.title}</h3>${data.content}`;
                hotspotModal.classList.remove('hidden');
            }
        });
    });
    
    // 关闭热点浮层
    closeHotspot.addEventListener('click', () => {
        hotspotModal.classList.add('hidden');
    });
    
    hotspotModal.addEventListener('click', (e) => {
        if (e.target === hotspotModal) {
            hotspotModal.classList.add('hidden');
        }
    });
}

// 分享功能
function setupShare() {
    shareBtn.addEventListener('click', () => {
        if (navigator.share) {
            navigator.share({
                title: '北平风物记 - 路线策展',
                text: '探索北京的文化漫游路线，发现更多精彩故事',
                url: window.location.href
            })
            .then(() => {
                console.log('分享成功');
            })
            .catch(err => {
                console.log('分享失败:', err);
                fallbackShare();
            });
        } else {
            fallbackShare();
        }
    });
    
    function fallbackShare() {
        navigator.clipboard.writeText(window.location.href)
        .then(() => {
            alert('链接已复制到剪贴板，您可以手动分享到社交平台');
        })
        .catch(err => {
            console.log('复制失败:', err);
            alert('请手动复制当前页面链接分享');
        });
    }
}

// 添加路线卡片的CSS样式
const style = document.createElement('style');
style.textContent = `
    .categories {
        display: flex;
        justify-content: center;
        gap: 20px;
        margin-bottom: 40px;
        flex-wrap: wrap;
    }
    
    .category-btn {
        background: white;
        border: 2px solid #1a1a2e;
        color: #1a1a2e;
        padding: 10px 20px;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.3s ease;
        border-radius: 5px;
    }
    
    .category-btn:hover, .category-btn.active {
        background: #1a1a2e;
        color: white;
    }
    
    .routes-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 30px;
        margin-bottom: 60px;
    }
    
    .route-card {
        background: white;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
        opacity: 1;
        transform: translateY(0);
    }
    
    .route-card:hover {
        transform: translateY(-10px);
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
    }
    
    .route-image {
        height: 200px;
        background-size: cover;
        background-position: center;
        position: relative;
        overflow: hidden;
    }
    
    .route-content {
        padding: 20px;
    }
    
    .route-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    }
    
    .route-header h3 {
        font-size: 1.3rem;
        color: #1a1a2e;
        margin: 0;
    }
    
    .route-duration {
        background: #f0f0f0;
        padding: 5px 10px;
        border-radius: 15px;
        font-size: 0.8rem;
        color: #666;
    }
    
    .route-description {
        color: #666;
        margin-bottom: 15px;
        line-height: 1.6;
    }
    
    .route-highlights {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 20px;
    }
    
    .highlight-tag {
        background: #e8f4f8;
        color: #1a73e8;
        padding: 3px 10px;
        border-radius: 15px;
        font-size: 0.8rem;
    }
    
    .featured-topic {
        background: white;
        padding: 40px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        margin-top: 60px;
    }
    
    .topic-title {
        font-size: 2rem;
        margin-bottom: 30px;
        color: #1a1a2e;
        text-align: center;
    }
    
    .topic-content {
        display: flex;
        gap: 30px;
        align-items: center;
    }
    
    .topic-image {
        flex: 1;
        height: 300px;
        background-size: cover;
        background-position: center;
        border-radius: 10px;
    }
    
    .topic-text {
        flex: 1;
    }
    
    .topic-text h4 {
        font-size: 1.5rem;
        margin-bottom: 15px;
        color: #1a1a2e;
    }
    
    .topic-text p {
        color: #666;
        margin-bottom: 20px;
        line-height: 1.8;
    }
    
    @media (max-width: 768px) {
        .routes-grid {
            grid-template-columns: 1fr;
        }
        
        .topic-content {
            flex-direction: column;
        }
        
        .topic-image {
            width: 100%;
        }
    }
`;
document.head.appendChild(style);

// 添加随机任务功能
function setupRandomTasks() {
    // 文学与光阴路线任务
    const literatureTasks = [
        "在书局里，找一本出版年份早于你出生年份的北京地图。",
        "发现一件与你姓氏相关的北京老地名或典故。",
        "轻声问掌柜：'关于这座塔，您听过最有趣的故事是什么？'"
    ];
    
    // 江南烟雨路线任务
    const jiangnanTasks = [
        "在馆中找一幅描绘雨中山水的画作，记住它的雾气走向。",
        "走到廊外，对照真实的湖面与竹林，寻找画意与真境交汇的那一瞬间。",
        "尝试用手机拍摄一个局部，构图像极了一幅古画。"
    ];
    
    // 与地坛同呼吸路线任务
    const ditanTasks = [
        "在方泽坛的某个角落坐下（像铁生那样），静默五分钟，只听风声。",
        "用手机备忘录或随身纸笔，记下此刻脑中盘旋的一个最纠结的问题，不必解答。",
        "思考：这个四百年前的祭祀空间，如何奇妙地成了一个现代个体与命运对话的'心理咨询室'？"
    ];
    
    // 文学路线任务生成
    const generateTaskBtn = document.getElementById('generate-task');
    const randomTaskText = document.getElementById('random-task');
    
    if (generateTaskBtn && randomTaskText) {
        generateTaskBtn.addEventListener('click', () => {
            const randomIndex = Math.floor(Math.random() * literatureTasks.length);
            randomTaskText.textContent = literatureTasks[randomIndex];
        });
    }
    
    // 江南路线任务生成
    const generateJiangnanBtn = document.getElementById('generate-task-jiangnan');
    const randomJiangnanTaskText = document.getElementById('random-task-jiangnan');
    
    if (generateJiangnanBtn && randomJiangnanTaskText) {
        generateJiangnanBtn.addEventListener('click', () => {
            const randomIndex = Math.floor(Math.random() * jiangnanTasks.length);
            randomJiangnanTaskText.textContent = jiangnanTasks[randomIndex];
        });
    }
    
    // 地坛路线任务生成
    const generateDitanBtn = document.getElementById('generate-task-ditan');
    const randomDitanTaskText = document.getElementById('random-task-ditan');
    
    if (generateDitanBtn && randomDitanTaskText) {
        generateDitanBtn.addEventListener('click', () => {
            const randomIndex = Math.floor(Math.random() * ditanTasks.length);
            randomDitanTaskText.textContent = ditanTasks[randomIndex];
        });
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);