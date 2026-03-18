let Quran = [];

// 📥 LOAD QURAN
async function loadQuran(){
  const res = await fetch("https://api.alquran.cloud/v1/quran/quran-uthmani");
  const data = await res.json();

  Quran = data.data.surahs;

  loadSidebar();
}

// 📂 SIDEBAR
function loadSidebar(){
  let box = document.getElementById("sidebarSurahs");

  let html = "";

  Quran.forEach(s=>{
    html += `
      <div class="surah" onclick="openSurah(${s.number})">
        ${s.number}. ${s.englishName}
      </div>
    `;
  });

  box.innerHTML = html;
}

// 📖 OPEN SURAH (NO REPEAT)
function openSurah(n){
  closeSidebar();

  let s = Quran.find(x=>x.number==n);
  let content = document.getElementById("content");

  let html = `<h2>${s.englishName}</h2>`;

  s.ayahs.forEach(a=>{
    html += `
      <div class="ayah">
        <div class="arabic">${a.text}</div>

        <button onclick="play(${n},${a.numberInSurah})">▶</button>
      </div>
    `;
  });

  content.innerHTML = html;
}

// 🎧 AUDIO
function play(s,a){
  new Audio(`https://cdn.islamic.network/quran/audio/128/ar.alafasy/${s}${a}.mp3`).play();
}

// 📱 SIDEBAR CONTROL
function openSidebar(){
  document.getElementById("sidebar").classList.add("active");
  document.getElementById("overlay").classList.add("active");
}

function closeSidebar(){
  document.getElementById("sidebar").classList.remove("active");
  document.getElementById("overlay").classList.remove("active");
}

// 🏠 HOME
function showHome(){
  document.getElementById("content").innerHTML = "<h2>Select a Surah 📖</h2>";
}

// 🚀 INIT
window.onload = ()=>{
  loadQuran();
  showHome();
};
