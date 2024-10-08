// 검색할 키워드 설정
const query = '스파르타 코딩클럽';

// API 호출 함수
function searchNews() {
    //const url = `https://newsapi-k17d.onrender.com/search?query=${encodeURIComponent(query)}`;
    const url = `https://newsapi-production-531e.up.railway.app/search?query=${encodeURIComponent(query)}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            // 기사 시간별 오름차순으로 정렬
            data.items.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
            // 상위 4개의 기사만 표시
            displayResults(data.items.slice(0, 7));
        })
        .catch(error => console.error('Error:', error));
}

// 날짜 형식 변환 함수
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return new Date(dateString).toLocaleDateString('ko-KR', options);
}

// 결과를 화면에 표시하는 함수
function displayResults(items) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    items.forEach(item => {
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        resultItem.innerHTML = `
        <div class="card">
        <div class="card-header">
        <a href="${item.link}" target="_blank">${item.title}</a class="title"> </div>
        <div class="card-body">
        <blockquote class="blockquote mb-0">
        <p>${item.description}</p>
        <footer class="blockquote-footer"><strong>게시 시간:</strong> ${formatDate(item.pubDate)}<cite title="Source Title"></cite></footer>
        </blockquote>
        </div>
        </div>`;

        resultsDiv.appendChild(resultItem);
    });
}

// 페이지 로드 시 API 호출
window.onload = searchNews;
