console.clear();

if (document.cookie.indexOf(',counter=') >= 0) {
    let counter = document.cookie.split(',')[1].split('=')[1];
    document.getElementById("badge").innerHTML = counter;
}

let cartContainer = document.getElementById('cartContainer');

let boxContainerDiv = document.createElement('div');
boxContainerDiv.id = 'boxContainer';

let totalContainerDiv = document.createElement('div');
totalContainerDiv.id = 'totalContainer';

let totalDiv = document.createElement('div');
totalDiv.id = 'total';
totalContainerDiv.appendChild(totalDiv);

let totalh2 = document.createElement('h2');
totalh2.textContent = 'Total Amount';
totalDiv.appendChild(totalh2);

// Button div
let buttonDiv = document.createElement('div');
buttonDiv.id = 'button';

let buttonTag = document.createElement('button');
buttonTag.textContent = 'Place Order';
buttonTag.onclick = function () {
    // Bersihkan cookie
    document.cookie = "item=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "counter=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    // Redirect ke orderPlaced.html
    window.location.href = '/tokoku/orderPlaced.html';
};
buttonDiv.appendChild(buttonTag);
totalDiv.appendChild(buttonDiv);

// Fungsi update jumlah
function amountUpdate(amount) {
    let totalh4 = document.createElement('h4');
    totalh4.textContent = 'Jumlah: Rp ' + amount;
    totalDiv.insertBefore(totalh4, buttonDiv); // Pastikan total muncul di atas tombol
    cartContainer.appendChild(totalContainerDiv);
}

// Fungsi render produk dalam cart
function dynamicCartSection(ob, itemCounter) {
    let boxDiv = document.createElement('div');
    boxDiv.id = 'box';

    let boxImg = document.createElement('img');
    boxImg.src = ob.preview;
    boxDiv.appendChild(boxImg);

    let boxh3 = document.createElement('h3');
    boxh3.textContent = ob.name + ' × ' + itemCounter;
    boxDiv.appendChild(boxh3);

    let boxh4 = document.createElement('h4');
    boxh4.textContent = 'Jumlah: Rp' + ob.price;
    boxDiv.appendChild(boxh4);

    boxContainerDiv.appendChild(boxDiv);
    return cartContainer;
}

// Fetch data dari API
let httpRequest = new XMLHttpRequest();
httpRequest.onreadystatechange = function () {
    if (this.readyState === 4) {
        if (this.status == 200) {
            let contentTitle = JSON.parse(this.responseText);

            let counter = Number(document.cookie.split(',')[1].split('=')[1]);
            document.getElementById("totalItem").innerHTML = 'Total Items: ' + counter;

            let item = document.cookie.split(',')[0].split('=')[1].split(" ");
            let totalAmount = 0;

            for (let i = 0; i < counter; i++) {
                let itemCounter = 1;
                for (let j = i + 1; j < counter; j++) {
                    if (Number(item[j]) === Number(item[i])) {
                        itemCounter++;
                    }
                }

                totalAmount += Number(contentTitle[item[i] - 1].price) * itemCounter;
                dynamicCartSection(contentTitle[item[i] - 1], itemCounter);
                i += (itemCounter - 1);
            }

            cartContainer.appendChild(boxContainerDiv);
            amountUpdate(totalAmount);
        } else {
            console.log('Call failed!');
        }
    }
};

httpRequest.open('GET', 'https://67f3e959cbef97f40d2ca4e8.mockapi.io/product/product', true);
httpRequest.send();
