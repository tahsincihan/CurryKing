document.addEventListener('DOMContentLoaded', function() {
    const orderData = localStorage.getItem('order');
    if (orderData) {
        const order = JSON.parse(orderData);
        const previewList = document.getElementById('preview-list');
        order.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item.text;
            previewList.appendChild(li);
        });
        updateTotalPreview();
    } else {
        document.getElementById('preview-list').textContent = 'No items in order.';
    }
});

function updateTotalPreview() {
    const orderData = localStorage.getItem('order');
    const order = JSON.parse(orderData);
    const total = order.reduce((acc, item) => acc + item.subtotal, 0);
    document.getElementById('total').textContent = `Total: £${total.toFixed(2)}`;
}
