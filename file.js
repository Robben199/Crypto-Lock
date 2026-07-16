let db;

const request = indexedDB.open("CryptoLockDB", 1);

request.onupgradeneeded = (event) => {
    db = event.target.result;

    db.createObjectStore("files", {
        keyPath: "id",
        autoIncrement: true
    });
};

request.onsuccess = (event) => {
    db = event.target.result;
    console.log("Database berhasil dibuka.");

    loadFiles();
};

request.onerror = () => {
    console.log("Gagal membuka database.");
};

const addBtn = document.getElementById("addFile");
const fileInput = document.getElementById("fileInput");
const fileList = document.getElementById("fileList");

addBtn.onclick = () => {
    fileInput.click();
};

fileInput.onchange = () => {

    if(fileInput.files.length > 0){

        const file = fileInput.files[0];

        const tx = db.transaction("files", "readwrite");
        const store = tx.objectStore("files");

        store.add({
            name: file.name,
            type: file.type,
            size: file.size,
            data: file
        });

        tx.oncomplete = () => {
    console.log("File berhasil disimpan!");
    loadFiles();
       };

    }

};

function loadFiles() {

    fileList.innerHTML = "";

    const tx = db.transaction("files", "readonly");
    const store = tx.objectStore("files");

    const request = store.getAll();

    request.onsuccess = () => {

        const files = request.result;

        if (files.length === 0) {
            fileList.innerHTML = "<p>Belum ada file.</p>";
            return;
        }

        files.forEach(file => {
    fileList.innerHTML += `
        <p class="file-item" data-id="${file.id}">
             ${file.name}
        </p>
    `;
        });
        document.querySelectorAll(".file-item").forEach(item => {

    item.onclick = () => {

        const id = Number(item.dataset.id);

        openFile(id);

             };

       });

    };

}

function openFile(id) {

    sessionStorage.setItem("selectedFile", id);

    window.location.href = "preview.html";

}

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