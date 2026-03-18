let Quran = [];

// LOAD QURAN
async function loadQuran() {
  alert("Downloading full Quran... ⏳");
  try {
    const res = await fetch("https://api.alquran.cloud/v1/quran/quran-uthmani");
    const data = await res.json();
    if(!data.data || data.data.surahs.length!==114) throw new Error("Incomplete data");

    Quran = data.data.surahs.map(s => ({number:s.number,name:s.englishName,ayahs:s.ayahs}));
    localStorage.setItem("quran",JSON.stringify(Quran));
    alert("✅ FULL Quran Loaded (114 Surahs)");
    showSurahs(Quran);
  } catch(e) {
    alert("❌ Download failed or incomplete. Try again.");
  }
}

// SHOW SURAH LIST
function showSurahs(data){
  document.querySelector(".center").style.display="none";
  const list=document.getElementById("surahList"); list.innerHTML="";
  data.forEach(s=>{
    list.innerHTML+=`<div class="surah" onclick="openSurah(${s.number})">${s.number}. ${s.name}</div>`;
  });
}

// OPEN SURAH
function openSurah(num){
  const surah = Quran.find(s=>s.number===num);
  const content=document.getElementById("content");
  if(!surah){content.innerHTML="❌ Download Quran first"; return;}
  localStorage.setItem("lastRead",num);
  content.innerHTML=`<h2>${surah.name}</h2>`;
  surah.ayahs.forEach(a=>{
    content.innerHTML+=`
      <div class="ayah">
        <p class="arabic">${a.text}</p>
        <p class="translation">${a.text}</p>
        <button onclick="play(${num},${a.numberInSurah})">▶</button>
        <button onclick="bookmark(${num},${a.numberInSurah})">⭐</button>
      </div>`;
  });
  closeSidebar();
}

// AUDIO
function play(surah,ayah){new Audio(`https://cdn.islamic.network/quran/audio/128/ar.alafasy/${surah}${ayah}.mp3`).play();}

// BOOKMARK
function bookmark(surah,ayah){
  let marks=JSON.parse(localStorage.getItem("marks")||"[]");
  marks.push({surah,ayah});
  localStorage.setItem("marks",JSON.stringify(marks));
  alert("Bookmarked ⭐");
}

// SIDEBAR
function openSidebar(){document.getElementById("sidebar").classList.add("active");document.getElementById("overlay").classList.add("active");}
function closeSidebar(){document.getElementById("sidebar").classList.remove("active");document.getElementById("overlay").classList.remove("active");}
function showHome(){document.getElementById("content").innerHTML="";closeSidebar();}
function showBookmarks(){
  const marks=JSON.parse(localStorage.getItem("marks")||"[]");const content=document.getElementById("content");
  content.innerHTML="<h2>Bookmarks ⭐</h2>";
  marks.forEach(m=>{content.innerHTML+=`<p onclick="openSurah(${m.surah})">Surah ${m.surah} - Ayah ${m.ayah}</p>`});
  closeSidebar();
}

// THEME
function toggleTheme(){document.body.classList.toggle("light");}

// AUTO LOAD
window.onload=()=>{
  Quran=JSON.parse(localStorage.getItem("quran")||"[]");
  if(Quran.length) showSurahs(Quran);
  const last=localStorage.getItem("lastRead"); if(last) openSurah(Number(last));
};
