// server.js - 北平风物记 (智谱 GLM-4-Flash 版)
const express = require('express');
const cors = require('cors');
// 动态引入 node-fetch
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// --- 配置区域 (关键修改) ---
// 1. 这里填入你在智谱平台申请的 API Key
const API_KEY = 'dbeee851b40b4654910afb61853d9b5d.Pdly9gA9ZsIHIsod'; 

// 2. 智谱的接口地址
const API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

// 系统人设
const SYSTEM_PROMPT = `
你叫“北平风物君”，是“北平风物记”网站的智能导游。
你的性格：博学、优雅、略带一点京味儿，热爱北京的历史文化。
你的任务：
1. 为游客介绍北京的历史典故、胡同文化、建筑艺术。
2. 语言风格要优美、有画面感，引用古诗词或历史文献，但要通俗易懂。
3. 你的回答不应太长，控制在200字以内，适合对话。
`;

app.post('/api/chat', async (req, res) => {
    try {
        const { message, history } = req.body;

        // 构造消息数组
        let messages = [{ role: 'system', content: SYSTEM_PROMPT }];

        // 添加历史记录
        if (history && Array.isArray(history)) {
            history.forEach(h => {
                if(h.parts && h.parts[0]) {
                    messages.push({
                        role: h.role === 'model' ? 'assistant' : 'user',
                        content: h.parts[0].text
                    });
                }
            });
        }

        // 添加用户最新问题
        messages.push({ role: 'user', content: message });

        console.log("正在请求智谱 GLM-4-Flash...");

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}` // 智谱也是用 Bearer Token
            },
            body: JSON.stringify({
                model: "glm-4-flash", // 3. 关键修改：模型名字改成 glm-4-flash (这是免费版)
                messages: messages,
                temperature: 0.7,
                max_tokens: 500,
                stream: false
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("API 报错详情:", data);
            throw new Error(data.error?.message || 'API 请求失败');
        }

        const reply = data.choices[0].message.content;
        console.log("智谱回复成功");

        res.json({ reply: reply });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ reply: "风物君正在故宫修文物，信号不太好，请稍后再试。" });
    }
});

app.listen(port, () => {
    console.log(`北平风物记后端服务已启动: http://localhost:${port}`);
});