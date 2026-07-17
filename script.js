//======================================
// CRYPTO LOCK V1
// BAGIAN 1 - DASAR
//======================================

// Huruf alfabet
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

// Mengubah huruf menjadi angka
function letterToNumber(letter){

    letter = letter.toUpperCase();

    return alphabet.indexOf(letter);

}

// Mengubah angka menjadi huruf
function numberToLetter(number){

    number = (number + 26) % 26;

    return alphabet[number];

}

// Mengubah teks menjadi array angka
function textToNumbers(text){

    text = text.toUpperCase();

    let result = [];

    for(let i = 0; i < text.length; i++){

        let value = letterToNumber(text[i]);

        if(value != -1){

            result.push(value);

        }

    }

    return result;

}

// Mengubah array angka menjadi teks
function numbersToText(numbers){

    let text = "";

    for(let i = 0; i < numbers.length; i++){

        text += numberToLetter(numbers[i]);

    }

    return text;

}

//======================================
// BAGIAN 2 - VIGENERE ENCRYPT
//======================================

// Mengubah kunci menjadi angka
function keyToNumbers(key){

    key = key.toUpperCase();

    let result = [];

    for(let i = 0; i < key.length; i++){

        let value = letterToNumber(key[i]);

        if(value != -1){

            result.push(value);

        }

    }

    return result;

}


// Enkripsi CodeName menggunakan Vigenere
function encryptCodeName(codeName, key){

    let textNumbers = textToNumbers(codeName);

    let keyNumbers = keyToNumbers(key);

    let result = [];


    for(let i = 0; i < textNumbers.length; i++){

        let textValue = textNumbers[i];

        let keyValue = keyNumbers[i % keyNumbers.length];


        let encrypted = (textValue + keyValue) % 26;


        result.push(encrypted);

    }


    return numbersToCode(result);

}


// Mengubah angka menjadi kode 2 digit
function numbersToCode(numbers){

    let code = "";

    for(let i = 0; i < numbers.length; i++){

        code += String(numbers[i]).padStart(2,"0");

    }

    return code;

}

//======================================
// BAGIAN 3 - VIGENERE DECRYPT
//======================================


// Mengubah kode 2 digit menjadi angka
function codeToNumbers(code){

    let numbers = [];

    for(let i = 0; i < code.length; i += 2){

        let value = parseInt(code.substring(i, i + 2));

        numbers.push(value);

    }

    return numbers;

}


// Dekripsi kode menjadi CodeName
function decryptCode(code, key){

    let codeNumbers = codeToNumbers(code);

    let keyNumbers = keyToNumbers(key);

    let result = [];


    for(let i = 0; i < codeNumbers.length; i++){

        let codeValue = codeNumbers[i];

        let keyValue = keyNumbers[i % keyNumbers.length];


        let decrypted = (codeValue - keyValue + 26) % 26;


        result.push(decrypted);

    }


    return numbersToText(result);

}

//======================================
// BAGIAN 4 - CONNECT HTML
//======================================


// Menjalankan proses saat tombol ditekan
function processCipher(){
	
	playClick();

    let mode = document.getElementById("mode").value;

    let codeName = document.getElementById("codename").value;

    let key = document.getElementById("key").value;

    let output = document.getElementById("output");

    // Cek apakah kunci kosong

    if(key === ""){

        output.value = "❌ Kunci Khusus belum diisi!";

        return;

    }


    // MODE ENKRIPSI

    if(mode === "encrypt"){


        if(codeName === ""){

            output.value = "❌ CodeName belum diisi!";

            return;

        }


        let result = encryptCodeName(codeName,key);


        prepareSave(codeName, result);


        output.value =
        "Kode Anda:\n\n" +
         result +
         "\n\nApakah kode sudah benar?\nTekan Konfirmasi Simpan.";


         document.getElementById("saveButton").style.display = "block";


    }



    // MODE DEKRIPSI

    else if(mode === "decrypt"){


        if(codeName === ""){

            output.value = "❌ Masukkan kode terlebih dahulu!";

            return;

        }


        let success = verifyCode(codeName, key);

        if(success){

       output.value =
       "✔️ Kode benar!\n\n" +
       "ACCESS GRANTED";
       
       window.location.href = "file.html";

       }
       else{

         output.value =
        "✖️ Kode atau Kunci salah!";

       }


    }


}

//======================================
// BAGIAN 5 - SAVE & VERIFY SYSTEM
//======================================


// Penyimpanan sementara sebelum konfirmasi kedua

let temporaryCode = "";
let temporaryCodeName = "";


// Menyiapkan data untuk disimpan

function prepareSave(codeName, code){

    temporaryCodeName = codeName.toUpperCase().trim();
    temporaryCode = code.trim();

}


// Menyimpan sandi ke sistem

function saveEncryption(){

    if(temporaryCode === "" || temporaryCodeName === ""){

        document.getElementById("output").value =
        "❌ Tidak ada sandi untuk disimpan!";

        return;

    }


    localStorage.setItem(
        "cryptocode",
        temporaryCode
    );


    localStorage.setItem(
        "cryptoname",
        temporaryCodeName
    );


    document.getElementById("output").value =
    "✔️ Sandi berhasil disimpan!";
    
    document.getElementById("saveButton").style.display = "none";

    temporaryCode = "";
    temporaryCodeName = "";


}



// Mengecek kode saat dekripsi

function verifyCode(inputCode, key){

    let savedCode = localStorage.getItem("cryptocode");

    let savedName = localStorage.getItem("cryptoname");

    inputCode = inputCode.trim();
    key = key.toUpperCase().trim();
    savedCode = savedCode.trim();
    savedName = savedName.toUpperCase().trim();

    if(savedCode === null || savedName === null){

        return false;

    }

    if(inputCode !== savedCode){

        return false;

    }


    let result = decryptCode(inputCode,key);


    if(result === savedName){

        return true;

    }


    return false;

}

//======================================
// BAGIAN 7 - UBAH LABEL MODE
//======================================

const modeSelect = document.getElementById("mode");

modeSelect.addEventListener("change", updateMode);

updateMode();

function updateMode(){

    let mode = modeSelect.value;

    let label = document.getElementById("mainLabel");

    let input = document.getElementById("codename");

    if(mode === "encrypt"){

        label.textContent = "CodeName";

        input.placeholder = "Contoh: HELLO";

    }

    else{

        label.textContent = "Kode";

        input.placeholder = "Contoh: 1708092118";

    }
    
}
    
 //======================================
// SOUND
//======================================

function playClick(){

    const sound = document.getElementById("clickSound");

    if (!sound) return;

    sound.currentTime = 0;
    sound.play().catch(err => console.log(err));

}

//======================================
// BAGIAN 8 - MATRIX BACKGROUND
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

window.onload = () => {
    setTimeout(() => {
        document.getElementById("splash").style.display = "none";
        document.getElementById("unlockMenu").style.display = "block";
    }, 2000); // 2 detik
};

//======================================
// FUNGSI RESET
//======================================

function resetForm(){

    document.getElementById("codename").value = "";
    document.getElementById("key").value = "";
    document.getElementById("output").value = "";

    temporaryCode = "";
    temporaryCodeName = "";

    document.getElementById("saveButton").style.display = "none";

}
