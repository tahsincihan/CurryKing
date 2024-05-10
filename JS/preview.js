document.addEventListener('DOMContentLoaded', function() {
    const orderData = localStorage.getItem('order');
    if (orderData) {
        const order = JSON.parse(orderData);
        const previewList = document.getElementById('preview-list');
        const orderDetailsDiv = document.getElementById('orderDetails');

        // Check if the order details and items are available
        if (order.details && order.items.length > 0) {
            let detailsHtml = `Order Type: ${order.orderType.charAt(0).toUpperCase() + order.orderType.slice(1)}<br/>`;
            if (order.orderType === 'collection') {
                detailsHtml += `Name: ${order.details.name}<br/>Contact Number: ${order.details.contactNumber}`;
            } else {
                detailsHtml += `Address: ${order.details.address}<br/>Postcode: ${order.details.postcode}<br/>Contact Number: ${order.details.contactNumber}`;
            }
            orderDetailsDiv.innerHTML = detailsHtml;

            order.items.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item.text;
                previewList.appendChild(li);
            });
            updateTotalPreview();
        } else {
            previewList.textContent = 'No items in order.';
        }
    } else {
        console.error('No order data found in localStorage.');
    }
});

function updateTotalPreview() {
    const orderData = localStorage.getItem('order');
    if (orderData) {
        const order = JSON.parse(orderData);
        const total = order.items.reduce((acc, item) => acc + item.subtotal, 0);
        document.getElementById('total').textContent = `Total: £${total.toFixed(2)}`;
    }
}
