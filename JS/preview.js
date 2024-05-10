document.addEventListener('DOMContentLoaded', function() {
    const orderData = localStorage.getItem('order');
    const previewList = document.getElementById('preview-list');
    const order = JSON.parse(orderData);

    if (order && order.length > 0) {
        order.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item.text;  // Use text from the item, which does not include 'Remove'
            previewList.appendChild(li);
        });
        updateTotalPreview();
    } else {
        previewList.textContent = 'No items in order.';
    }
});

function updateTotalPreview() {
    const orderData = localStorage.getItem('order');
    const order = JSON.parse(orderData);
    const total = order.reduce((acc, item) => acc + parseFloat(item.subtotal), 0);
    document.getElementById('total').textContent = `Total: £${total.toFixed(2)}`;
}
