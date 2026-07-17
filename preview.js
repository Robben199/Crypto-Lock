//DATABASE

let db;

const deleteBtn = document.getElementById("deleteBtn");
const popup = document.getElementById("deletePopup");
const deleteText = document.getElementById("deleteText");
const cancelDelete = document.getElementById("cancelDelete");
const confirmDelete = document.getElementById("confirmDelete");

const exportBtn = document.getElementById("exportBtn");

const openRequest = indexedDB.open("CryptoLockDB", 1);

openRequest.onsuccess = (event) => {
    db = event.target.result;

    console.log("Database berhasil dibuka.");
    
    const id = Number(sessionStorage.getItem("selectedFile"));

console.log("ID File:", id);

const tx = db.transaction("files", "readonly");
const store = tx.objectStore("files");

const request = store.get(id);

request.onsuccess = () => {

    const file = request.result;

    console.log(file);
    
//FUNGSI HAPUS
    
    deleteBtn.onclick = () => {

    deleteText.textContent = `Hapus "${file.name}"?`;

    popup.style.display = "flex";

};

cancelDelete.onclick = () => {

    popup.style.display = "none";

};

confirmDelete.onclick = () => {

    const tx = db.transaction("files", "readwrite");
    const store = tx.objectStore("files");

    store.delete(file.id);

    tx.oncomplete = () => {

        popup.style.display = "none";

        window.location.href = "file.html";

    };
    
};
    
    //FUNGSI EKSPOR
    exportBtn.onclick = () => {

    const url = URL.createObjectURL(file.data);

    const a = document.createElement("a");

    a.href = url;
    a.download = file.name;

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

    URL.revokeObjectURL(url);

   };
    const previewArea = document.getElementById("previewArea");

    previewArea.innerHTML = "";
    
    if (file.type.startsWith("image/")) {

    const img = document.createElement("img");

    img.src = URL.createObjectURL(file.data);

    previewArea.appendChild(img);

}
    
    const fileInfo = document.getElementById("fileInfo");

    fileInfo.innerHTML = `
        <b>Nama:</b> ${file.name}<br>
        <b>Ukuran:</b> ${formatSize(file.size)}<br>
        <b>Tipe:</b> ${file.type}
    `;

     }
};

openRequest.onerror = () => {
    console.log("Gagal membuka database.");
};

document.getElementById("backBtn").onclick = () => {
    window.location.href = "file.html";
};

//UKURAN DIPERSIMPEL

function formatSize(bytes) {

    if (bytes < 1024) {
        return bytes + " B";
    }

    if (bytes < 1024 * 1024) {
        return (bytes / 1024).toFixed(2) + " KB";
    }

    if (bytes < 1024 * 1024 * 1024) {
        return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    }

    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
}

//======================================
// MATRIX BACKGROUND
//======================================

const canvas = document.getElementById("matrixCanvas");

const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const letters = "01";

const fontSize = 20;

const columns = Math.floor(canvas.width / fontSize);

const drops = [];

for(let i = 0; i < columns; i++){

    drops[i] = 1;

}

function drawMatrix(){

    ctx.fillStyle = "rgba(0,0,0,0.08)";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle = "#00ff00";

    ctx.font = fontSize + "px monospace";

    for(let i = 0; i < drops.length; i++){

        const text =
        letters.charAt(
        Math.floor(Math.random()*letters.length)
        );

        ctx.fillText(
            text,
            i*fontSize,
            drops[i]*fontSize
        );

        if(
            drops[i]*fontSize > canvas.height
            &&
            Math.random() > 0.98
        ){

            drops[i]=0;

        }

        drops[i]++;

    }

}

setInterval(drawMatrix,35);

window.addEventListener("resize",()=>{

    canvas.width = window.innerWidth;

    canvas.height = window.innerHeight;

});
