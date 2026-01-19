// server.js - 全栈版 (支持 API + 图片音频托管)
const express = require('express');
const cors = require('cors');
const path = require('path'); // 1. 引入 path 模块
// 动态引入 node-fetch
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// --- 2. 配置静态资源托管 (最重要的一步) ---
// 这行代码的意思是：当前文件夹下的所有文件，都可以通过浏览器直接访问
// 比如：http://localhost:3000/image/logo.png
app.use(express.static(path.join(__dirname, '.')));
// ----------------------------------------

// 配置 API Key (智谱)
const API_KEY = 'dbeee851b40b4654910afb61853d9b5d.Pdly9gA9ZsIHIsod'; // ⚠️记得换回你的 Key
const API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

const SYSTEM_PROMPT = `你叫“北平风物君”...（保持你的人设不变）...`;

// AI 对话接口
app.post('/api/chat', async (req, res) => {
    try {
        const { message, history } = req.body;
        // ... (保持原本的 AI 逻辑不变) ...
        // ...
        // ...
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ reply: "服务器开小差了..." });
    }
});

app.listen(port, () => {
    console.log(`北平风物记已启动！`);
    console.log(`- 主页访问: http://localhost:${port}`);
    console.log(`- 图片测试: http://localhost:${port}/image/logo.png`);
});