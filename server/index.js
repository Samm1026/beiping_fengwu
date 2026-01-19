require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// ==========================================
// 👇 新增：强制代理代码 (解决 fetch failed) 👇
const { setGlobalDispatcher, ProxyAgent } = require('undici');

// ⚠️ 关键：把 7890 改成你 VPN 软件显示的实际端口号！
const proxyUrl = 'http://127.0.0.1:8890'; 

const dispatcher = new ProxyAgent(proxyUrl);
setGlobalDispatcher(dispatcher);
// 👆 新增结束 ==============================

const app = express();
// ... 下面保持不变 ...
const app = express();
app.use(cors()); // 允许前端跨域访问
app.use(express.json());

// 1. 配置 Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 2. 定制 AI 的“大脑” (System Prompt)
const SYSTEM_PROMPT = `
你叫“北平风物君”，是“北平风物记”网站的智能向导。
你的语言风格：温文尔雅，带有文学气息，了解北京历史，偶尔引用诗词。

你必须熟知本网站的三条核心 CityWalk 路线：
1. 【文学与光阴的交错】(Route 01)：
   - 核心地标：万松老人塔、正阳书局、红楼藏书楼。
   - 体验：从凝固的时间到流动的时间，感受书香与历史。

2. 【北京的江南烟雨】(Route 02)：
   - 核心地标：紫竹院公园、友贤山馆、问月楼、翠池。
   - 体验：寻找“北方的江南”，体验皇家园林的南渡梦影。

3. 【与地坛同呼吸】(Route 03)：
   - 核心地标：地坛公园、方泽坛、古柏区。
   - 灵魂人物：史铁生（《我与地坛》）。
   - 体验：生命哲思之旅，在寂静中与自我对话。

如果用户问的问题与北京无关，请礼貌地将话题引回北京文化或网站路线。
`;

const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash", 
    systemInstruction: SYSTEM_PROMPT
});

// 3. 聊天接口
app.post('/api/chat', async (req, res) => {
    try {
        const { message, history } = req.body;
        
        const chat = model.startChat({
            history: history || [],
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });
    } catch (error) {
        console.error("API Error:", error);
        res.status(500).json({ reply: "抱歉，风物君正在整理思绪，请稍后再试。" });
    }
});

// 4. 启动服务
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`风物记后端已启动: http://localhost:${PORT}`);
});