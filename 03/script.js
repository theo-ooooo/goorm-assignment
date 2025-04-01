const videos = [
  {
    title: "🔥 React JS Crash Course 2024",
    channel: "Code Master",
    views: "조회수 100만회",
    uploaded: "1년 전",
    duration: "18:47",
    thumbnail: "https://i.ytimg.com/vi/w7ejDZ8SWv8/hqdefault.jpg",
    profile: "https://i.pravatar.cc/150?img=5",
  },
  {
    title: "이 고양이 너무 웃겨요 ㅋㅋㅋ",
    channel: "냥냥채널",
    views: "조회수 57만회",
    uploaded: "2년 전",
    duration: "2:34",
    thumbnail: "https://i.ytimg.com/vi/J---aiyznGQ/hqdefault.jpg",
    profile: "https://i.pravatar.cc/150?img=7",
  },
  {
    title: "부산 브이로그 | 감천문화마을, 해운대, 회 먹방",
    channel: "BusanTrip",
    views: "조회수 12만회",
    uploaded: "6개월 전",
    duration: "9:20",
    thumbnail: "https://i.ytimg.com/vi/w7ejDZ8SWv8/hqdefault.jpg",
    profile: "https://i.pravatar.cc/150?img=8",
  },
  {
    title: "Java Spring Boot 완전 정복",
    channel: "DevTalk",
    views: "조회수 32만회",
    uploaded: "3년 전",
    duration: "45:00",
    thumbnail: "https://i.ytimg.com/vi/J---aiyznGQ/hqdefault.jpg",
    profile: "https://i.pravatar.cc/150?img=9",
  },
  {
    title: "아이폰 꿀기능 10가지 📱",
    channel: "IT채널",
    views: "조회수 5만회",
    uploaded: "3주 전",
    duration: "7:15",
    thumbnail: "https://i.ytimg.com/vi/J---aiyznGQ/hqdefault.jpg",
    profile: "https://i.pravatar.cc/150?img=10",
  },
  {
    title: "백색소음으로 집중하기 (1시간 ASMR)",
    channel: "집중 채널",
    views: "조회수 80만회",
    uploaded: "1년 전",
    duration: "1:00:00",
    thumbnail: "https://i.ytimg.com/vi/J---aiyznGQ/hqdefault.jpg",
    profile: "https://i.pravatar.cc/150?img=12",
  },
];

function initializeApp() {
  renderVideos();
  setupSearch();
}

document.addEventListener("DOMContentLoaded", () => {
  initializeApp();
});

function renderVideos() {
  const container = document.getElementById("video-container");
  container.innerHTML = "";
  videos.forEach((video) => {
    createVideoElement(video, container);
  });
}

function handleSearch(input) {
  const keyword = input.value.toLowerCase();
  const filtered = videos.filter(
    (v) =>
      v.title.toLowerCase().includes(keyword) ||
      v.channel.toLowerCase().includes(keyword)
  );
  renderFiltered(filtered);
}

function setupSearch() {
  const searchButton = document.querySelector(".search-button");
  const searchInput = document.querySelector(".search-input");

  console.log(searchButton);
  console.log(searchInput);

  if (!searchButton || !searchInput) {
    return;
  }

  searchButton.addEventListener("click", () => handleSearch(searchInput));
  searchInput.addEventListener("keypress", (event) => {
    if (event.key !== "Enter") {
      return;
    }
    handleSearch(searchInput);
  });
}

function renderFiltered(list) {
  const container = document.getElementById("video-container");
  container.innerHTML = "";
  list.forEach((video) => {
    createVideoElement(video, container);
  });
}

function createVideoElement(video, container) {
  if (!video || !container) {
    return;
  }
  const card = document.createElement("article");
  card.className = "video-card";
  card.innerHTML = `
  <div class="thumbnail-container">
    <img src="${video.thumbnail}" alt="썸네일" />
    <span class="duration">${video.duration}</span>
  </div>
  <div class="video-meta">
    <img class="profile" src="${video.profile}" alt="채널 이미지" />
    <div class="text">
      <div class="title">${video.title}</div>
      <div class="channel">${video.channel}</div>
      <div class="views">${video.views} • ${video.uploaded}</div>
    </div>
    <div class="menu">⋮</div>
  </div>
`;

  container.appendChild(card);
}
