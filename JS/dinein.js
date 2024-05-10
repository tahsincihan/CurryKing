document.addEventListener('DOMContentLoaded', function() {
    setupCategories();
    document.getElementById('previewOrder').addEventListener('click', previewDineInOrder); // Updated to new function name
});

function previewDineInOrder() {
    const orderItems = document.querySelectorAll('#order-list li');
    const order = Array.from(orderItems).map(li => {
        return {
            text: li.textContent,
            subtotal: parseFloat(li.dataset.subtotal)
        };
    });
    localStorage.setItem('order', JSON.stringify(order));  // Store the order in local storage
    window.location.href = 'dinein-preview.html';  // Redirect to the dine-in specific preview page
}
function setupCategories() {
    const categories = document.getElementsByClassName('menu-category');
    Array.from(categories).forEach(category => {
        const header = category.getElementsByTagName('h2')[0];
        header.addEventListener('click', function() {
            const itemsDiv = category.getElementsByClassName('menu-items')[0];
            itemsDiv.style.display = itemsDiv.style.display === 'none' ? 'block' : 'none';
            console.log('Toggle display for:', category.id);  // Debugging log
            if (!itemsDiv.hasChildNodes()) {
                console.log('Loading items for:', category.id);  // Debugging log
                loadItems(category.id, itemsDiv);
            }
        });
    });
}

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
            { name: "Chicken Korma", price: 10.50 },
            { name: "Chicken Curry", price: 10.50 },
        ]
    }[categoryId] || [];

    dishes.forEach(dish => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'menu-item';
        itemDiv.innerHTML = `
            <h4>${dish.name}</h4>
            <p>Price: £${dish.price.toFixed(2)}</p>
            <input type="number" value="1" min="1" class="quantity" data-price="${dish.price}">
            <textarea class="dish-note" placeholder="Add a note"></textarea>
            <button onclick="addToOrder(this)">Add to Order</button>
        `;
        itemsDiv.appendChild(itemDiv);
    });
}

function addToOrder(button, categoryId) {
    const itemDiv = button.parentNode;
    const name = itemDiv.querySelector('h4').innerText;
    const note = itemDiv.querySelector('.dish-note') ? itemDiv.querySelector('.dish-note').value : ''; // Ensure there's a text area for notes
    const quantity = parseInt(itemDiv.querySelector('.quantity').value);
    const price = parseFloat(itemDiv.querySelector('.quantity').dataset.price);
    const riceSelector = itemDiv.querySelector('.rice-options');
    const riceOption = riceSelector ? riceSelector.value : '0'; // Check if there's a rice option selected
    const additionalCost = riceOption !== '0' ? parseFloat(riceOption) : 0; // Only add additional cost if not default
    const subtotal = (price + additionalCost) * quantity;

    let details = `${name} - x ${quantity}`;
    if (categoryId !== "starters" && additionalCost > 0) {
        const riceName = riceSelector.options[riceSelector.selectedIndex].text;
        details += ` (${riceName})`; // Add rice option in brackets if it's not a starter and has an added cost
    }
    if (note) details += ` - Note: ${note}`; // Add notes if available

    const li = document.createElement('li');
    li.textContent = details;
    li.dataset.subtotal = subtotal; // Store the subtotal for calculation
    document.getElementById('order-list').appendChild(li);

    updateTotal();
}



function updateTotal() {
    const orderItems = document.querySelectorAll('#order-list li');
    const total = Array.from(orderItems).reduce((acc, item) => acc + parseFloat(item.dataset.subtotal), 0);
    document.getElementById('total').textContent = `Total: £${total.toFixed(2)}`;
}

function goBack() {
    window.location.href = '/CurryKing/index.html'; // Adjust the path as necessary
}
