function addWatermark() {
    // 水印文字内容
    const watermarkText = "Vivien's Notebook"; 
    // 水印元素的样式
    const style = `
        position: fixed;
        font-size: 20px;
        color: rgba(0, 0, 0, 0.1);
        transform: rotate(-30deg);
        pointer-events: none;
        z-index: 9999;
        white-space: nowrap;
    `;

    // 定义水印元素之间的间距
    const xSpacing = 200; 
    const ySpacing = 150; 

    // 计算水平和垂直方向需要创建的水印数量
    const numX = Math.ceil(window.innerWidth / xSpacing);
    const numY = Math.ceil(window.innerHeight / ySpacing);

    for (let i = 0; i < numX; i++) {
        for (let j = 0; j < numY; j++) {
            const watermark = document.createElement('div');
            watermark.className = 'watermark';
            watermark.textContent = watermarkText;
            watermark.style.cssText = style;
            // 设置水印元素的位置
            watermark.style.left = i * xSpacing + 'px';
            watermark.style.top = j * ySpacing + 'px';
            document.body.appendChild(watermark);
        }
    }
}

// 页面加载完成后添加水印
window.addEventListener('load', addWatermark);