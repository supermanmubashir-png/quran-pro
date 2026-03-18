let Quran = [];
let currentReciter = localStorage.getItem("reciter") || "ar.alafasy";

// 🔔 NOTIFY
function notify(msg){
  if(Notification.permission==="granted"){
    new Notification(msg);
  } else {
    Notification.requestPermission();
  }
}

// 📥 LOAD QURAN
async function loadQuran(){
  const res = await fetch("https://api.alquran.cloud/v1/quran/quran-uthmani");
  const data = await res.json();

  Quran = data.data.surahs;
  localStorage.setItem("quran", JSON.stringify(Quran));

  showSurahs();
  loadSidebar();
}

// 📜 SHOW SURAHS
function showSurahs(){
  let list = document.getElementById("surahList");

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

// 📂 SIDEBAR
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

// 📖 OPEN SURAH
function openSurah(n){
  let s = Quran.find(x=>x.number==n);
  let content = document.getElementById("content");

  let html = `<h2>${s.englishName}</h2>`;

  s.ayahs.forEach(a=>{
    html += `
      <div class="ayah">
        <div class="arabic">${a.text}</div>

        <button onclick="play(${n},${a.numberInSurah})">▶</button>
        <button onclick="bookmark(${n},${a.numberInSurah})">⭐</button>
        <button onclick="showTafsir(${a.number})">📖</button>
      </div>
    `;
  });

  content.innerHTML = html;
}

// 🎧 AUDIO
function play(s,a){
  new Audio(`https://cdn.islamic.network/quran/audio/128/${currentReciter}/${s}${a}.mp3`).play();
}

// ⭐ BOOKMARK
function bookmark(s,a){
  let b = JSON.parse(localStorage.getItem("b") || "[]");
  b.push({s,a});
  localStorage.setItem("b", JSON.stringify(b));
}

// 🏠 HOME
function showHome(){
  document.getElementById("content").innerHTML = "";
  document.getElementById("surahList").style.display = "block";
}

// ⚙️ SETTINGS
function openSettings(){
  document.getElementById("settingsPanel").classList.toggle("hidden");
}

// 🎧 CHANGE RECITER
function changeReciter(){
  let r = document.getElementById("reciter").value;
  localStorage.setItem("reciter", r);
  currentReciter = r;
  alert("Reciter changed 🎧");
}

// ⭐ BOOKMARKS VIEW
function showBookmarks(){
  let b = JSON.parse(localStorage.getItem("b") || "[]");
  let content = document.getElementById("content");

  if(b.length === 0){
    content.innerHTML = "<h3>No bookmarks ⭐</h3>";
    return;
  }

  let html = "<h2>Bookmarks</h2>";

  b.forEach(x=>{
    html += `
      <div class="ayah">
        Surah ${x.s} - Ayah ${x.a}
        <button onclick="openSurah(${x.s})">Open</button>
      </div>
    `;
  });

  document.getElementById("surahList").style.display = "none";
  content.innerHTML = html;
}

// 📱 SIDEBAR
function openSidebar(){
  document.getElementById("sidebar").classList.add("active");
  document.getElementById("overlay").classList.add("active");
}

function closeSidebar(){
  document.getElementById("sidebar").classList.remove("active");
  document.getElementById("overlay").classList.remove("active");
}

// 🌙 THEME
function toggleTheme(){
  document.body.classList.toggle("light");
}

// 🕌 NAMAZ
function showNamaz(){
  document.getElementById("namazPanel").classList.toggle("hidden");

  navigator.geolocation.getCurrentPosition(pos=>{
    let lat = pos.coords.latitude;
    let lon = pos.coords.longitude;

    fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=2`)
    .then(r=>r.json())
    .then(data=>{
      let t = data.data.timings;

      document.getElementById("namazTimes").innerHTML = `
        Fajr: ${t.Fajr}<br>
        Dhuhr: ${t.Dhuhr}<br>
        Asr: ${t.Asr}<br>
        Maghrib: ${t.Maghrib}<br>
        Isha: ${t.Isha}
      `;

      notify("Time for Salah 🕌");
    });
  });
}

// 📖 TAFSIR
function showTafsir(ayah){
  fetch(`https://api.alquran.cloud/v1/ayah/${ayah}/en.asad`)
  .then(r=>r.json())
  .then(d=>{
    alert("Tafsir:\n\n" + d.data.text);
  });
}

// 🧭 QIBLA
function showQibla(){
  document.getElementById("qiblaPanel").classList.toggle("hidden");

  window.addEventListener("deviceorientation", e=>{
    let deg = e.alpha;
    document.getElementById("compass").style.transform = `rotate(${deg}deg)`;
  });
}

// 🚀 INIT
window.onload = async ()=>{
  let saved = JSON.parse(localStorage.getItem("quran") || "[]");

  if(saved.length){
    Quran = saved;
    showSurahs();
    loadSidebar();
  } else {
    await loadQuran();
  }
};
