// 地图页面交互脚本

// DOM元素
const mapMarkers = document.querySelectorAll('.map-marker');
const locationTitle = document.getElementById('location-title');
const locationContent = document.getElementById('location-content');
const routeLink = document.getElementById('route-link');
const shareBtn = document.getElementById('share-btn');

// 初始化地图交互
function initMap() {
    setupMapMarkers();
    setupShare();
}

// 设置地图标记点
function setupMapMarkers() {
    mapMarkers.forEach(marker => {
        marker.addEventListener('click', () => {
            const locationId = marker.dataset.location;
            const data = locationData[locationId];
            
            if (data) {
                // 更新信息面板
                locationTitle.textContent = data.title;
                locationContent.innerHTML = data.content;
                routeLink.href = data.routeLink;
                routeLink.style.display = 'inline-block';
                
                // 添加选中样式
                mapMarkers.forEach(m => m.classList.remove('active'));
                marker.classList.add('active');
            }
        });
    });
}

// 设置分享功能
function setupShare() {
    shareBtn.addEventListener('click', () => {
        if (navigator.share) {
            navigator.share({
                title: '北平风物记 - 北京文化地图',
                text: '探索北京的历史文化地图，发现更多精彩景点',
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

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initMap);

// 添加地图相关的CSS样式
const style = document.createElement('style');
style.textContent = `
    .map-container {
        display: flex;
        gap: 30px;
        margin-bottom: 60px;
    }
    
    .map-view {
        flex: 3;
        height: 500px;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }
    
    .map-image {
        width: 100%;
        height: 100%;
        background-size: cover;
        background-position: center;
        position: relative;
    }
    
    .map-marker {
        position: absolute;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .map-marker:hover {
        transform: scale(1.2);
    }
    
    .map-marker.active {
        transform: scale(1.3);
    }
    
    .marker-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 5px;
    }
    
    .marker-icon {
        font-size: 2rem;
    }
    
    .marker-label {
        background: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 3px 8px;
        border-radius: 5px;
        font-size: 0.8rem;
        white-space: nowrap;
    }
    
    .map-info-panel {
        flex: 1;
        background: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }
    
    .map-info-panel h3 {
        font-size: 1.5rem;
        margin-bottom: 20px;
        color: #1a1a2e;
    }
    
    .map-info-panel p {
        margin-bottom: 15px;
        line-height: 1.8;
    }
    
    .route-preview {
        margin-top: 60px;
    }
    
    .route-preview h3 {
        font-size: 1.8rem;
        margin-bottom: 30px;
        color: #1a1a2e;
        text-align: center;
    }
    
    .route-list {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
    }
    
    .route-item {
        background: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }
    
    .route-item h4 {
        font-size: 1.3rem;
        margin-bottom: 10px;
        color: #1a1a2e;
    }
    
    .route-item p {
        color: #666;
        margin-bottom: 20px;
    }
    
    @media (max-width: 768px) {
        .map-container {
            flex-direction: column;
        }
        
        .map-view {
            height: 400px;
        }
        
        .route-list {
            grid-template-columns: 1fr;
        }
    }
`;
document.head.appendChild(style);