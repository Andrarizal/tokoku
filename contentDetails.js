console.clear();

// dd: cek apakah JS dipanggil
console.log("✅ contentDetails.js berhasil dipanggil!");

let id = location.search.split('?')[1];
console.log("📦 ID dari URL:", id);

// Tampilkan badge cart dari cookie jika ada
if (document.cookie.indexOf(',counter=') >= 0) {
    let counter = document.cookie.split(',')[1].split('=')[1];
    document.getElementById("badge").innerHTML = counter;
}

function dynamicContentDetails(ob) {
    console.log("🧩 Memuat data produk ke halaman:", ob);

    let mainContainer = document.createElement('div');
    mainContainer.id = 'containerD';
    document.getElementById('containerProduct').appendChild(mainContainer);

    let imageSectionDiv = document.createElement('div');
    imageSectionDiv.id = 'imageSection';

    let imgTag = document.createElement('img');
    imgTag.id = 'imgDetails';
    imgTag.src = ob.preview;
    imageSectionDiv.appendChild(imgTag);

    let productDetailsDiv = document.createElement('div');
    productDetailsDiv.id = 'productDetails';

    let h1 = document.createElement('h1');
    h1.appendChild(document.createTextNode(ob.name));

    let h4 = document.createElement('h4');
    h4.appendChild(document.createTextNode(ob.brand));

    let detailsDiv = document.createElement('div');
    detailsDiv.id = 'details';

    let h3DetailsDiv = document.createElement('h3');
    h3DetailsDiv.appendChild(
        document.createTextNode(
            ob.price.toLocaleString('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            })
        )
    );

    let h3 = document.createElement('h3');
    h3.appendChild(document.createTextNode('Description'));

    let para = document.createElement('p');
    para.appendChild(document.createTextNode(ob.description));

    let buttonDiv = document.createElement('div');
    buttonDiv.id = 'button';

    let buttonTag = document.createElement('button');
    buttonTag.appendChild(document.createTextNode('Add to Cart'));
    buttonTag.onclick = function () {
        let order = id + " ";
        let counter = 1;
        if (document.cookie.indexOf(',counter=') >= 0) {
            order = id + " " + document.cookie.split(',')[0].split('=')[1];
            counter = Number(document.cookie.split(',')[1].split('=')[1]) + 1;
        }
        document.cookie = "orderId=" + order + ",counter=" + counter;
        document.getElementById("badge").innerHTML = counter;
        console.log("🛒 Cookie update:", document.cookie);
    };

    buttonDiv.appendChild(buttonTag);

    // Merakit semua elemen
    mainContainer.appendChild(imageSectionDiv);
    mainContainer.appendChild(productDetailsDiv);
    productDetailsDiv.appendChild(h1);
    productDetailsDiv.appendChild(h4);
    productDetailsDiv.appendChild(detailsDiv);
    detailsDiv.appendChild(h3DetailsDiv);
    detailsDiv.appendChild(h3);
    detailsDiv.appendChild(para);
    productDetailsDiv.appendChild(buttonDiv);

    return mainContainer;
}

// BACKEND CALLING
let httpRequest = new XMLHttpRequest();
httpRequest.onreadystatechange = function () {
    if (this.readyState === 4) {
        if (this.status === 200) {
            console.log("🔗 Berhasil mengambil data dari API!");
            let contentDetails = JSON.parse(this.responseText);
            console.log("🗂️ Data dari API:", contentDetails);
            dynamicContentDetails(contentDetails);
        } else {
            console.error("❌ Gagal mengambil data. Status:", this.status);
        }
    }
};

httpRequest.open('GET', 'https://67f3e959cbef97f40d2ca4e8.mockapi.io/product/product/' + id, true);
httpRequest.send();
