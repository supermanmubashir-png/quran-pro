// ============================
// 🔥 QURAAN PRO FINAL (SAFE)
// ============================

let Quran = [];
let currentSurah = null;
let currentAyahIndex = 0;

let reciter = localStorage.getItem("reciter") || "ar.alafasy";
let audio = new Audio();

let loopMode = false;
let continueMode = false;
let showTranslation = false;

// ============================
// 📥 LOAD QURAN + TRANSLATION
// ============================
async function loadQuran(){
  let res = await fetch("https://api.alquran.cloud/v1/quran/quran-uthmani");
  let data = await res.json();
  Quran = data.data.surahs;

  loadSidebar();
}

// ============================
// 📂 SIDEBAR
// ============================
function loadSidebar(){
  let box = document.getElementById("sidebarSurahs");
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

// ============================
// 📖 OPEN SURAH
// ============================
async function openSurah(num){
  currentSurah = Quran.find(s => s.number === num);
  if(!currentSurah) return;

  let content = document.getElementById("content");

  let html = `<h2>${currentSurah.englishName}</h2>`;

  // 🔥 FETCH TRANSLATION
  let translationData = null;
  if(showTranslation){
    let t = await fetch(`https://api.alquran.cloud/v1/surah/${num}/en.asad`);
    let tData = await t.json();
    translationData = tData.data.ayahs;
  }

  currentSurah.ayahs.forEach((a, i)=>{
    html += `
      <div class="ayah">
        <div class="arabic">${a.text}</div>

        ${showTranslation ? `<div class="translation">${translationData[i].text}</div>` : ""}

        <div class="controls">
          <button onclick="playAyah(${i})">▶️</button>
          <button onclick="toggleLoop(${i})">🔁</button>
          <button onclick="startContinue(${i})">⏭</button>
          <button onclick="bookmark(${i})">⭐</button>
          <button onclick="showTafsir(${a.number})">📖</button>
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
  audio.src = `https://cdn.islamic.network/quran/audio/128/${reciter}/${ayahNum}.mp3`;

  audio.play();
}

audio.onended = ()=>{
  if(loopMode) playAyah(currentAyahIndex);

  if(continueMode){
    currentAyahIndex++;
    if(currentAyahIndex < currentSurah.ayahs.length){
      playAyah(currentAyahIndex);
    }
  }
};

// ============================
// 🔁 LOOP / CONTINUE
// ============================
function toggleLoop(i){
  loopMode = true;
  continueMode = false;
  playAyah(i);
}

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
  alert("Bookmarked ⭐");
}

// ============================
// 📖 TAFSIR
// ============================
function showTafsir(num){
  fetch(`https://api.alquran.cloud/v1/ayah/${num}/en.asad`)
  .then(r=>r.json())
  .then(d=>{
    alert(d.data.text);
  });
}

// ============================
// 🌍 TRANSLATION TOGGLE
// ============================
function toggleTranslation(){
  showTranslation = !showTranslation;
  if(currentSurah){
    openSurah(currentSurah.number);
  }
}

// ============================
// ⚙️ SETTINGS
// ============================
function changeReciter(r){
  reciter = r;
  localStorage.setItem("reciter", r);
}

function toggleDark(){
  document.body.classList.toggle("dark");
}

// ============================
// 🕌 NAMAZ
// ============================
function showNamaz(){
  navigator.geolocation.getCurrentPosition(pos=>{
    fetch(`https://api.aladhan.com/v1/timings?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}`)
    .then(r=>r.json())
    .then(d=>{
      let t = d.data.timings;
      alert(`Fajr:${t.Fajr}\nDhuhr:${t.Dhuhr}\nAsr:${t.Asr}\nMaghrib:${t.Maghrib}\nIsha:${t.Isha}`);
    });
  });
}

// ============================
// 🧭 QIBLA
// ============================
function showQibla(){
  window.addEventListener("deviceorientation", e=>{
    alert("Rotate device for Qibla 🧭");
  });
}

// ============================
// 📂 SIDEBAR CONTROL
// ============================
function openSidebar(){
  document.getElementById("sidebar").classList.add("active");
}
function closeSidebar(){
  document.getElementById("sidebar").classList.remove("active");
}

// ============================
// 🚀 INIT
// ============================
window.onload = ()=>{
  loadQuran();
};
