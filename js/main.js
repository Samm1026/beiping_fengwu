document.addEventListener('DOMContentLoaded', () => {
    // 滚动进度条
    const progressBar = document.getElementById('progressBar');
    window.addEventListener('scroll', () => {
        if(!progressBar) return;
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + "%";
    });

    // 元素浮现动画
    const reveals = document.querySelectorAll('.reveal');
    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    reveals.forEach(reveal => revealOnScroll.observe(reveal));

    // 章节导航高亮
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.chapter-nav a');
    if(sections.length > 0 && navLinks.length > 0) {
        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if(pageYOffset >= (sectionTop - 300)) {
                    current = section.getAttribute('id');
                }
            });
            navLinks.forEach(link => {
                link.classList.remove('active');
                if(link.getAttribute('href').includes(current)) {
                    link.classList.add('active');
                }
            });
        });
    }

    // 随机任务逻辑
    const tasks = {
        'literature': [
            "找到一本出版年份比你年龄还大的关于北京的书。",
            "拍一张塔影与现代建筑同框的照片。",
            "在院子里闭上眼，记录下你听到的三种声音。",
            "询问店主，这本书局里最古老的一件物品是什么。"
        ]
    };

    window.generateTask = function(category) {
        const taskDisplay = document.getElementById('task-display-area');
        const btn = document.querySelector('.btn-generate');
        if(!taskDisplay) return;
        
        taskDisplay.style.opacity = 0;
        btn.disabled = true;
        btn.innerText = "抽取中...";
        
        setTimeout(() => {
            const taskList = tasks[category] || tasks['literature'];
            const randomTask = taskList[Math.floor(Math.random() * taskList.length)];
            taskDisplay.innerText = `"${randomTask}"`;
            taskDisplay.style.opacity = 1;
            btn.disabled = false;
            btn.innerText = "抽取新任务";
        }, 500);
    };
});

/* --- AI 海报生成器逻辑 --- */

// 1. 数据池：基于您的项目文档 [cite: 161-253]
const aiData = [
    {
        type: 'literature',
        route: '文学与光阴的交错',
        img: 'image/wansongta.png', // 对应您的图片
        quotes: [
            "塔，是信仰与纪念的物化，是穿越王朝的纪念碑时间。",
            "真正的力量，来自于内心的秩序。你不必烧香，只需仰望。",
            "历史从教科书里走下来，变成了可以触摸、可以购买的实体。",
            "天堂应该是图书馆的模样，也是塔下书局的模样。"
        ]
    },
    {
        type: 'jiangnan',
        route: '北京的江南烟雨',
        img: 'image/zizhuyuan.png', // 对应您的图片
        quotes: [
            "北方雄浑的骨架，披上了江南秀美的肌理。",
            "竹是文人的虚心与气节，一泓墨水，满池竹影。",
            "逍遥自得，享闲居之乐。这份乐，四百年前就已备好。",
            "问的不是天文，而是文化乡愁。"
        ]
    },
    {
        type: 'ditan',
        route: '与地坛同呼吸',
        img: 'image/ditan.png', // 对应您的图片
        quotes: [
            "在人口密聚的城市里，有这样一个宁静的去处，像是上帝的苦心安排。",
            "时间在这里不是线性流逝的，而是直立着、环状地生长。",
            "死是一个必然会降临的节日。",
            "物理的空，被文学和亲情填满了永恒的牵挂。"
        ]
    }
];

// 打开模态框
function openAiModal() {
    const modal = document.getElementById('ai-modal');
    modal.classList.remove('hidden'); // 移除 display:none
    // 强制重绘以触发 transition
    setTimeout(() => { modal.classList.add('active'); }, 10);
    
    // 自动填充日期
    const date = new Date();
    document.getElementById('poster-date').innerText = `${date.getFullYear()}.${date.getMonth()+1}.${date.getDate()}`;
}

// 关闭模态框
function closeAiModal() {
    const modal = document.getElementById('ai-modal');
    modal.classList.remove('active');
    setTimeout(() => { modal.classList.add('hidden'); }, 400);
}

// 快速填词
function setMood(word) {
    document.getElementById('user-mood').value = word;
}

// 核心：生成逻辑
function generateAiPoster() {
    const mood = document.getElementById('user-mood').value || "随心";
    const btn = document.querySelector('.btn-generate-ai');
    
    // 1. 模拟 AI 思考动画
    btn.innerText = "正在分析心境...";
    btn.disabled = true;

    setTimeout(() => {
        // 2. 随机算法：随机选择一条路线和对应的金句
        const randomRoute = aiData[Math.floor(Math.random() * aiData.length)];
        const randomQuote = randomRoute.quotes[Math.floor(Math.random() * randomRoute.quotes.length)];

        // 3. 填充 DOM
        document.getElementById('poster-bg').src = randomRoute.img;
        document.getElementById('poster-keyword').innerText = mood;
        document.getElementById('poster-text').innerText = `“${randomQuote}”`;
        document.getElementById('poster-route-name').innerText = randomRoute.route;

        // 4. 切换视图
        document.getElementById('step-input').classList.add('hidden');
        document.getElementById('step-result').classList.remove('hidden');
        
        // 恢复按钮状态
        btn.innerText = "开始生成";
        btn.disabled = false;
        
    }, 1500); // 1.5秒延迟模拟计算感
}

// 重置
function resetAi() {
    document.getElementById('step-result').classList.add('hidden');
    document.getElementById('step-input').classList.remove('hidden');
    document.getElementById('user-mood').value = '';
}

// 下载功能 (使用 html2canvas)
function downloadPoster() {
    const element = document.getElementById('poster-canvas');
    const btn = document.querySelector('.btn-download');
    
    btn.innerText = "生成图片中...";
    
    html2canvas(element, {
        useCORS: true, // 允许跨域图片
        scale: 2       // 高清两倍图
    }).then(canvas => {
        // 创建下载链接
        const link = document.createElement('a');
        link.download = '北平风物记_漫游海报.png';
        link.href = canvas.toDataURL();
        link.click();
        
        btn.innerText = "📥 保存海报";
    });
}