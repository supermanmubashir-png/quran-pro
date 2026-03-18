// ============================
// 🔥 QURAAN PRO ULTRA APP.JS
// ============================

let Quran = [];
let currentSurah = null;
let currentAyahIndex = 0;
let loopMode = false;
let continueMode = false;
let audio = new Audio();

// ============================
// 🔔 NOTIFICATION
// ============================
function notify(msg){
  if(Notification.permission === "granted"){
    new Notification(msg);
  } else {
    Notification.requestPermission();
  }
}

// ============================
// 📥 LOAD QURAN
// ============================
async function loadQuran(){
  try{
    const res = await fetch("https://api.alquran.cloud/v1/quran/quran-uthmani");
    const data = await res.json();

    Quran = data.data.surahs;

    showSurahs();
    loadSidebar();

    // Resume last read
    let last = localStorage.getItem("lastSurah");
    if(last){
      openSurah(parseInt(last));
    }

  }catch(e){
    console.error("Load error:", e);
  }
}

// ============================
// 📜 MAIN LIST
// ============================
function showSurahs(){
  const list = document.getElementById("surahList");
  if(!list) return;

  let html = "";
  Quran.forEach(s=>{
    html += `
      <div class="surah" onclick="openSurah(${s.number})">
        ${s.number}. ${s.englishName}
      </div>
    `;
  });

  list.innerHTML = html;
}

// ============================
// 📂 SIDEBAR
// ============================
function loadSidebar(){
  const box = document.getElementById("sidebarSurahs");
  if(!box) return;

  let html = "";
  Quran.forEach(s=>{
    html += `
      <div class="surah" onclick="openSurah(${s.number}); closeSidebar();">
        ${s.number}. ${s.englishName}
      </div>
    `;
  });

  box.innerHTML = html;
}

function openSidebar(){
  document.getElementById("sidebar").classList.add("active");
}

function closeSidebar(){
  document.getElementById("sidebar").classList.remove("active");
}

// ============================
// 📖 OPEN SURAH
// ============================
function openSurah(num){
  currentSurah = Quran.find(s => s.number === num);
  if(!currentSurah) return;

  localStorage.setItem("lastSurah", num);

  const content = document.getElementById("content");

  let html = `<h2>${currentSurah.englishName}</h2>`;

  currentSurah.ayahs.forEach((a, i)=>{
    html += `
      <div class="ayah">
        <div class="arabic">${a.text}</div>

        <div class="controls">
          <button onclick="playAyah(${i})">▶️</button>
          <button onclick="toggleLoop(${i})">🔁</button>
          <button onclick="startContinue(${i})">⏭</button>
          <button onclick="bookmark(${i})">⭐</button>
        </div>
      </div>
    `;
  });

  content.innerHTML = html;
}

// ============================
// 🔊 AUDIO
// ============================
function playAyah(i){
  currentAyahIndex = i;

  let ayahNum = currentSurah.ayahs[i].number;
  audio.src = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayahNum}.mp3`;

  audio.play();
}

audio.onended = ()=>{
  if(loopMode){
    playAyah(currentAyahIndex);
  }

  if(continueMode){
    currentAyahIndex++;
    if(currentAyahIndex < currentSurah.ayahs.length){
      playAyah(currentAyahIndex);
    }
  }
};

// ============================
// 🔁 LOOP MODE
// ============================
function toggleLoop(i){
  loopMode = true;
  continueMode = false;
  playAyah(i);
}

// ============================
// ⏭ CONTINUE MODE
// ============================
function startContinue(i){
  continueMode = true;
  loopMode = false;
  playAyah(i);
}

// ============================
// ⭐ BOOKMARK
// ============================
function bookmark(i){
  localStorage.setItem("bookmark", JSON.stringify({
    surah: currentSurah.number,
    ayah: i
  }));
  notify("Bookmarked ⭐");
}

// ============================
// 📌 LOAD BOOKMARK
// ============================
function loadBookmark(){
  let b = JSON.parse(localStorage.getItem("bookmark"));
  if(!b) return;

  openSurah(b.surah);

  setTimeout(()=>{
    playAyah(b.ayah);
  },500);
}

// ============================
// 🌙 DARK MODE
// ============================
function toggleDark(){
  document.body.classList.toggle("dark");
}

// ============================
// 🔍 SEARCH
// ============================
function searchSurah(q){
  q = q.toLowerCase();

  let filtered = Quran.filter(s => 
    s.englishName.toLowerCase().includes(q)
  );

  let list = document.getElementById("surahList");

  let html = "";
  filtered.forEach(s=>{
    html += `<div onclick="openSurah(${s.number})">${s.englishName}</div>`;
  });

  list.innerHTML = html;
}

// ============================
// 🧭 SCROLL TOP
// ============================
function scrollTopBtn(){
  window.scrollTo({top:0, behavior:"smooth"});
}

// ============================
// 🕌 FAKE NAMAZ TIME (DEMO)
// ============================
function prayerNotify(){
  setInterval(()=>{
    let h = new Date().getHours();

    if(h === 5) notify("Fajr Time 🕌");
    if(h === 13) notify("Dhuhr Time 🕌");
    if(h === 18) notify("Maghrib Time 🕌");

  },60000);
}

// ============================
// 🚀 INIT
// ============================
window.onload = ()=>{
  loadQuran();
  prayerNotify();
};
