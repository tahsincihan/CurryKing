document.addEventListener('DOMContentLoaded', function() {
    const categories = document.getElementsByClassName('menu-category');
    Array.from(categories).forEach(category => {
        const header = category.getElementsByTagName('h2')[0];
        header.addEventListener('click', function() {
            const itemsDiv = category.getElementsByClassName('menu-items')[0];
            itemsDiv.style.display = itemsDiv.style.display === 'none' ? 'block' : 'none';
            if (!itemsDiv.hasChildNodes()) {
                loadItems(category.id, itemsDiv);
            }
        });
    });

    document.getElementById('previewOrder').addEventListener('click', previewOrder);
});

function loadItems(categoryId, itemsDiv) {
    const dishes = {
        "starters": [
            { name: "King Prawn Butterfly", price: 5.95 },
            { name: "King Prawn Puri", price: 5.95 },
            { name: "Tandoori King Prawn", price: 5.95 },
            { name: "Prawn Puri", price: 3.95 },
            { name: "Tandoori Chicken Starter", price: 3.95 },
        ],
        "chicken": [
            { name: "Chicken Korma", price: 9.50, options: [{ name: 'Pilau Rice', additionalCost: 0 }, { name: 'Plain Rice', additionalCost: 0 }, { name: 'Egg Fried Rice', additionalCost: 1 }, { name: 'Musroom Fried Rice', additionalCost: 1 }, { name: 'Garlic Fried Rice', additionalCost: 1 },{ name: 'Special Fried Rice', additionalCost: 1 }] },
            { name: "Chicken Madras", price: 9.50, options: [{ name: 'Pilau Rice', additionalCost: 0 }, { name: 'Plain Rice', additionalCost: 0 }, { name: 'Egg Fried Rice', additionalCost: 1 }, { name: 'Musroom Fried Rice', additionalCost: 1 }, { name: 'Garlic Fried Rice', additionalCost: 1 },{ name: 'Special Fried Rice', additionalCost: 1 }] },
            { name: "Chicken Curry", price: 9.50, options: [{ name: 'Pilau Rice', additionalCost: 0 }, { name: 'Plain Rice', additionalCost: 0 }, { name: 'Egg Fried Rice', additionalCost: 1 }, { name: 'Musroom Fried Rice', additionalCost: 1 }, { name: 'Garlic Fried Rice', additionalCost: 1 },{ name: 'Special Fried Rice', additionalCost: 1 }] },
        ],
        "lamb":[
            { name: "Lamb Korma", price: 9.50, options: [{ name: 'Pilau Rice', additionalCost: 0 }, { name: 'Plain Rice', additionalCost: 0 }, { name: 'Egg Fried Rice', additionalCost: 1 }, { name: 'Musroom Fried Rice', additionalCost: 1 }, { name: 'Garlic Fried Rice', additionalCost: 1 },{ name: 'Special Fried Rice', additionalCost: 1 }] },
            { name: "Lamb Madras", price: 9.50, options: [{ name: 'Pilau Rice', additionalCost: 0 }, { name: 'Plain Rice', additionalCost: 0 }, { name: 'Egg Fried Rice', additionalCost: 1 }, { name: 'Musroom Fried Rice', additionalCost: 1 }, { name: 'Garlic Fried Rice', additionalCost: 1 },{ name: 'Special Fried Rice', additionalCost: 1 }] },
        ]
        // Add other categories with their respective dishes here
    }[categoryId];

    dishes.forEach(dish => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'menu-item';
        let optionsHTML = dish.options ? `<select class="rice-options">${dish.options.map(option => `<option value="${option.additionalCost}">${option.name}</option>`).join('')}</select>` : '';
        
        itemDiv.innerHTML = `
            <h4>${dish.name}</h4>
            ${optionsHTML}
            <p>Price: £${dish.price.toFixed(2)}</p>
            <input type="number" value="1" min="1" class="quantity" data-price="${dish.price}">
            <textarea class="dish-note" placeholder="Add a note"></textarea>
            <button onclick="addToOrder(this, '${categoryId}')">Add to Order</button>
        `;
        itemsDiv.appendChild(itemDiv);
    });
}
function addToOrder(button, categoryId) {
    const itemDiv = button.parentNode;
    const name = itemDiv.querySelector('h4').innerText;
    const note = itemDiv.querySelector('.dish-note') ? itemDiv.querySelector('.dish-note').value : '';
    const quantity = parseInt(itemDiv.querySelector('.quantity').value);
    const riceSelect = itemDiv.querySelector('.rice-options');
    const riceOption = riceSelect && riceSelect.value !== "0" ? riceSelect.selectedOptions[0].text : '';
    const additionalCost = riceSelect ? parseFloat(riceSelect.value) : 0;
    const price = parseFloat(itemDiv.querySelector('.quantity').dataset.price) + additionalCost;
    const subtotal = price * quantity;

    const displayText = `${name}${riceOption && riceOption !== 'Pilau Rice' ? ' (' + riceOption + ')' : ''} - x${quantity}${note ? ' - Note: ' + note : ''}`;

    const li = document.createElement('li');
    li.textContent = displayText;
    li.dataset.subtotal = subtotal.toString();  // Make sure this is a string for consistency

    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.className = 'remove-button';
    removeButton.onclick = function() { removeFromOrder(li); };
    li.appendChild(removeButton);

    document.getElementById('order-list').appendChild(li);

    updateTotal();
}


function previewOrder() {
    const orderType = document.getElementById('orderType').value;
    const orderDetails = {};

    if (orderType === 'collection') {
        orderDetails.name = document.getElementById('name').value;
        orderDetails.contactNumber = document.getElementById('contactNumber').value;
    } else {
        orderDetails.address = document.getElementById('address').value;
        orderDetails.postcode = document.getElementById('postcode').value;
        orderDetails.contactNumber = document.getElementById('deliveryContactNumber').value;
    }

    const orderItems = document.querySelectorAll('#order-list li');
    const items = Array.from(orderItems).map(li => {
        return {
            text: li.childNodes[0].nodeValue,
            subtotal: parseFloat(li.dataset.subtotal)
        };
    });

    const order = {
        details: orderDetails,
        items: items,
        orderType: orderType
    };

    localStorage.setItem('order', JSON.stringify(order));
    window.location.href = '/CurryKing/Pages/preview.html';
}



function updateTotal() {
    const orderItems = document.querySelectorAll('#order-list li');
    const total = Array.from(orderItems).reduce((acc, item) => acc + parseFloat(item.dataset.subtotal || 0), 0);
    document.getElementById('total').textContent = `Total: £${total.toFixed(2)}`;
}



function goBack() {
    window.location.href = '/CurryKing/index.html'; // Adjust the path as necessary
}

function removeFromOrder(item) {
    item.remove(); // Removes the item from the DOM
    updateTotal(); // Updates the total after an item is removed
}


function toggleOrderType() {
    var orderType = document.getElementById('orderType').value;
    if (orderType === 'collection') {
        document.getElementById('collectionInfo').style.display = 'block';
        document.getElementById('deliveryInfo').style.display = 'none';
    } else if (orderType === 'delivery') {
        document.getElementById('collectionInfo').style.display = 'none';
        document.getElementById('deliveryInfo').style.display = 'block';
    }
}

function submitOrder() {
    var orderType = document.getElementById('orderType').value;
    var name = document.getElementById('name').value;
    var contactNumber = document.getElementById('contactNumber').value;
    var address = document.getElementById('address').value;
    var postcode = document.getElementById('postcode').value;
    var deliveryContactNumber = document.getElementById('deliveryContactNumber').value;

    // Here you can handle the submission of the order details
    console.log('Order Type:', orderType);
    if (orderType === 'collection') {
        console.log('Name:', name, 'Contact Number:', contactNumber);
    } else {
        console.log('Address:', address, 'Postcode:', postcode, 'Contact Number:', deliveryContactNumber);
    }
}


function submitAddress() {
    // You can add code here to handle the submission of the address
    // This could include validation, formatting, and sending it to a server
    console.log("Submitting Address");
}

function displayAddress(data) {
    var addressInfo = `
        <strong>Postcode:</strong> ${data.postcode}<br>
        <strong>Country:</strong> ${data.country}<br>
        <strong>Region:</strong> ${data.region}<br>
        <strong>Parish:</strong> ${data.parish}<br>
        <strong>Admin District:</strong> ${data.admin_district}<br>
    `;
    document.getElementById('addressResult').innerHTML = addressInfo;
}


document.getElementById('previewOrder').addEventListener('click', function() {
    const orderType = document.getElementById('orderType').value;
    const name = orderType === 'collection' ? document.getElementById('collectionName').value : '';
    const number = orderType === 'collection' ? document.getElementById('collectionNumber').value : document.getElementById('deliveryNumber').value;
    const address = orderType === 'delivery' ? document.getElementById('deliveryAddress').value : '';

    const orderDetails = { orderType, name, number, address };
    localStorage.setItem('orderDetails', JSON.stringify(orderDetails));
    window.location.href = '/CurryKing/Pages/preview.html';
});
