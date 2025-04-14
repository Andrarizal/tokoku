console.clear();

// Inisialisasi elemen cart container
const cartContainer = document.getElementById('cartContainer');
const boxContainerDiv = document.createElement('div');
boxContainerDiv.id = 'boxContainer';

// Tambahkan box container ke dalam cart
cartContainer.appendChild(boxContainerDiv);

// Total section
const totalContainerDiv = document.createElement('div');
totalContainerDiv.id = 'totalContainer';

const totalDiv = document.createElement('div');
totalDiv.id = 'total';
totalContainerDiv.appendChild(totalDiv);

const totalh2 = document.createElement('h2');
totalh2.innerText = 'Total Amount';
totalDiv.appendChild(totalh2);

// Tombol Place Order
const buttonDiv = document.createElement('div');
buttonDiv.id = 'button';
totalDiv.appendChild(buttonDiv);

const buttonTag = document.createElement('button');
buttonDiv.appendChild(buttonTag);

const buttonLink = document.createElement('a');
buttonLink.href = '/orderPlaced.html?';
buttonLink.innerText = 'Place Order';
buttonTag.appendChild(buttonLink);

buttonTag.onclick = () => {
    console.log("clicked");
};

// Fungsi render item ke cart
function dynamicCartSection(product, itemCounter) {
    const boxDiv = document.createElement('div');
    boxDiv.className = 'box'; // gunakan class bukan id jika lebih dari 1

    const boxImg = document.createElement('img');
    boxImg.src = product.preview;
    boxDiv.appendChild(boxImg);

    const boxh3 = document.createElement('h3');
    boxh3.innerText = `${product.name} × ${itemCounter}`;
    boxDiv.appendChild(boxh3);

    const boxh4 = document.createElement('h4');
    boxh4.innerText = `Jumlah: Rp ${product.price}`;
    boxDiv.appendChild(boxh4);

    boxContainerDiv.appendChild(boxDiv);
}

// Fungsi update total amount
function amountUpdate(amount) {
    const totalh4 = document.createElement('h4');
    totalh4.id = 'toth4';
    totalh4.innerText = `Jumlah: Rp ${amount}`;
    totalDiv.appendChild(totalh4);

    // Tambahkan total container ke cart
    cartContainer.appendChild(totalContainerDiv);
}

// Ambil data dari cookie
function getCookieData() {
    const cookie = document.cookie;
    if (!cookie.includes('counter=')) return null;

    const parts = cookie.split(',');
    let items = [];
    let counter = 0;

    parts.forEach(part => {
        const [key, value] = part.trim().split('=');
        if (key === 'counter') counter = parseInt(value);
        else if (key === 'items') items = value.trim().split(' ');
    });

    return { counter, items };
}

// Ambil data dari cookie & render cart
const cookieData = getCookieData();
if (cookieData) {
    document.getElementById("badge").innerText = cookieData.counter;
}

// Panggil data produk dari API
const httpRequest = new XMLHttpRequest();
httpRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
        const products = JSON.parse(this.responseText);
        const cookieData = getCookieData();
        if (!cookieData) return;

        const { counter, items } = cookieData;
        document.getElementById("totalItem").innerText = 'Total Items: ' + counter;

        let totalAmount = 0;
        for (let i = 0; i < counter; i++) {
            let itemCounter = 1;
            for (let j = i + 1; j < counter; j++) {
                if (Number(items[j]) === Number(items[i])) itemCounter++;
            }

            const product = products[items[i] - 1];
            if (product) {
                dynamicCartSection(product, itemCounter);
                totalAmount += product.price * itemCounter;
            }

            i += (itemCounter - 1); // skip duplicate items
        }

        amountUpdate(totalAmount);
    }
};

httpRequest.open('GET', 'https://67f3e959cbef97f40d2ca4e8.mockapi.io/product/product', true);
httpRequest.send();
