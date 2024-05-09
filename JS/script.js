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
            { name: "Chicken Korma", price: 9.50, options: [{ name: 'Pilau Rice', additionalCost: 0 }, { name: 'Plain Rice', additionalCost: 0 }, { name: 'Egg Fried Rice', additionalCost: 1 }] },
            { name: "Chicken Curry", price: 9.50, options: [{ name: 'Pilau Rice', additionalCost: 0 }, { name: 'Plain Rice', additionalCost: 0 }, { name: 'Egg Fried Rice', additionalCost: 1 }] },
        ],
        // Add other categories with their respective dishes here
    }[categoryId];

    dishes.forEach(dish => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'menu-item';
        let optionsHTML = '';
        if (dish.options) {
            optionsHTML = `<select class="rice-options">${dish.options.map(option => `<option value="${option.additionalCost}">${option.name}</option>`).join('')}</select>`;
        }
        itemDiv.innerHTML = `
            <h4>${dish.name}</h4>
            ${optionsHTML}
            <p>Price: £${dish.price.toFixed(2)}</p>
            <input type="number" value="1" min="1" class="quantity" data-price="${dish.price}">
            <textarea class="dish-note" placeholder="Add a note"></textarea>
            <button onclick="addToOrder(this)">Add to Order</button>
        `;
        itemsDiv.appendChild(itemDiv);
    });
}

function addToOrder(button) {
    const itemDiv = button.parentNode;
    const name = itemDiv.querySelector('h4').innerText;
    const selectedRice = itemDiv.querySelector('.rice-options') ? itemDiv.querySelector('.rice-options').selectedOptions[0].textContent : '';
    const note = itemDiv.querySelector('.dish-note').value;
    const quantity = parseInt(itemDiv.querySelector('.quantity').value);
    const price = parseFloat(itemDiv.querySelector('.quantity').dataset.price);
    const additionalCost = itemDiv.querySelector('.rice-options') ? parseFloat(itemDiv.querySelector('.rice-options').value) : 0;
    const subtotal = (price + additionalCost) * quantity;

    const riceText = selectedRice !== 'Pilau Rice' ? ` (${selectedRice})` : '';
    const li = document.createElement('li');
    li.textContent = `${name}${riceText} - x ${quantity}${note ? ' - Note: ' + note : ''}`;
    li.dataset.subtotal = subtotal;
    document.getElementById('order-list').appendChild(li);

    updateTotal();
}

function updateTotal() {
    const orderItems = document.querySelectorAll('#order-list li');
    const total = Array.from(orderItems).reduce((acc, item) => acc + parseFloat(item.dataset.subtotal), 0);
    document.getElementById('total').textContent = `Total: £${total.toFixed(2)}`;
}

function previewOrder() {
    const orderItems = document.querySelectorAll('#order-list li');
    const order = Array.from(orderItems).map(li => {
        return {
            text: li.textContent,
            subtotal: parseFloat(li.dataset.subtotal)
        };
    });
    localStorage.setItem('order', JSON.stringify(order));
    window.location.href = '/CurryKing/Pages/preview.html';
}

function goBack() {
    window.location.href = '/CurryKing/index.html'; // Adjust the path as necessary
}
