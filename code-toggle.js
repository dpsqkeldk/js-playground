async function loadCode(fileName) {
    try {
        const response = await fetch(fileName);
        const code = await response.text();
        return code;
    } catch (error) {
        console.error('파일을 불러오는데 실패했습니다:', error);
        return '코드를 불러올 수 없습니다.';
    }
}

async function toggleCode(codeType) {
    const codeBlock = document.getElementById('codeBlock');
    const codeTypeElement = document.getElementById('code-type');
    
    // 파일 경로 매핑
    const files = {
        'HTML': 'calculator3.html',
        'CSS': 'calculator3.css',
        'JS': 'calculator3.js'
    };

    if (codeBlock.style.display === 'none') {
        codeBlock.style.display = 'block';
        // 코드 불러오기
        const code = await loadCode(files[codeType]);
        codeTypeElement.textContent = code;
    } else {
        codeBlock.style.display = 'none';
    }
}