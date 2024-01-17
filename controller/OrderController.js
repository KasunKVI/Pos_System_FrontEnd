
var nicPattern = /^(19[2-9]\d|20[0-1]\d)\d{8}|^[2-9]\d{8}V$/;
var namePattern = /^[A-Za-z '-]+$/;
var contactNumberPattern = /^(070|071|076|077|072|078|075|074)\d{7}$/;
var pricePattern = /^(  \d+(\.\d{1,2})?)$/;
var discountPattern = /^\d+(\.\d+)?$/;

var total = 0;
let orderCounter = 1;

var orderItems = [];
const generateOrderId = () => {

    $.ajax({
        type: "GET",
        url: "http://localhost:8080/Pos_System_BackEnd/invoiceApi",
        contentType: "application/json",

        success: function (response) {



            const formattedOrderId = String(orderCounter).padStart(4, '0');

            let lastOrderId = response;

            console.log(response)
            lastOrderId = (parseInt(lastOrderId) + 1).toString().padStart(4, '0');
            $('#floatingInput11').val(lastOrderId);


        },
        error: function (xhr, status, error) {
            toastr.error('Something Error');
        }
    });


}

$('#order_link1, #order_link').on('click', () => {
    generateOrderId();
});


//load customer details and validate customer id
$('#floatingInput13').on('input', () => {

    let customer_id = $('#floatingInput13').val();

    let isIdValid = nicPattern.test(customer_id);

    if(customer_id && isIdValid) {


        $.ajax({
            type: "GET",
            url: "http://localhost:8080/Pos_System_BackEnd/customerApi?customerId=" + customer_id,
            contentType: "application/json",

            success: function (response) {

                $('#floatingInput14').val(response.name);
                $('#floatingInput15').val(response.mobile_no);

            },
            error: function (xhr, status, error) {
                toastr.error('Something Error');
            }
        });

    }else {
        toastr.error('Invalid Customer Id');
    }

});

//load Item details via item id
$('#floatingInput16').on('input', () => {


    let id = $('#floatingInput16').val();

    $.ajax({
        type: "GET",
        url: "http://localhost:8080/Pos_System_BackEnd/itemApi?itemId=" + id,
        contentType: "application/json",

        success: function (response) {

            // Convert the date format from "Jan 1, 2024" to "yyyy-MM-dd"
            var formattedDate = moment(response.exp, "MMM D, YYYY").format("YYYY-MM-DD");

            $('#floatingInput18').val(response.name);
            $('#floatingInput20').val(formattedDate);
            $('#floatingInput19').val(response.price);

        },
        error: function (xhr, status, error) {
            toastr.error('Something Error');
        }
    });


});


//call add item to cart function
$("#item_add_cart").on("click", () => {

    addItemToCart();

});



//add item to cart
function addItemToCart() {

    let id = $('#floatingInput16').val();
    let name = $('#floatingInput18').val();
    let price = $('#floatingInput19').val();
    let qty = $('#floatingInput17').val();
    let exp = $('#floatingInput20').val();

    if (id) {

        if (name) {

            if (price) {

                if (exp) {

                    let for_item = price * qty;

                    total += for_item;

                    $("#total_bal").text(total.toFixed(2));


                    $.ajax({
                        type: "PUT",
                        url: "http://localhost:8080/Pos_System_BackEnd/itemApi?itemId=" + id + "&qty=" + qty,


                        success: function (response) {
                            $("#total_big").text("Rs. " + total.toFixed(2));
                        },
                        error: function (xhr, status, error) {
                            toastr.error('Something Error');
                        }
                    });

                    let item= {
                        itemId:id,
                        qty:qty
                    };
                    orderItems.push(item);

                    $("#total_big").text("Rs. " + total.toFixed(2));

                    loadOrderItems(id,name,price,qty)
                    clearItemDetails();

                } else {
                    toastr.error('Input Item Exp Date');
                }
            } else {
                toastr.error('Input Item Price');
            }
        } else {
            toastr.error('Invalid Item Name');
        }
    } else {
        toastr.error('Invalid Item Id');
    }
}

//add discount to item and validate the discount
$('#floatingInput30').on('input', () => {

    let discount = $('#floatingInput30').val();

    if (discount){

        let isMatch = discountPattern.test(discount);

        if (isMatch){

            total = total - (total * discount / 100);

            $('#item_add_cart').prop('disabled', false);

        }else {
            $('#item_add_cart').prop('disabled', true);
            toastr.error('Invalid discount value');
        }

    }else {
        $('#item_add_cart').prop('disabled', false);
    }

});


//call the add customer payment function
$('#customer_payment').on('keydown', (event) => {

    if (event.key === "Enter") {
        event.preventDefault();
        addCustomerPayment();

    }

});

//call the add customer payment function
$("#addCustomerPayment").on("click", (event) => {
    event.preventDefault();
    addCustomerPayment();

});

function addCustomerPayment () {

    let customerPayment = parseFloat($('#customer_payment').val());

    $("#customer_payed").text(customerPayment.toFixed(2));

    let last_balance = customerPayment - total;

    $("#last_balance").text(last_balance.toFixed(2));


}

    // clean inputs
    const clearOrderUpdateForm = () => {
        $('#order_search_input').val('');
        $('#floatingInput21').val('');
        $('#floatingInput22').val('');
        $('#floatingInput23').val('');
        $('#floatingInput24').val('');
        $('#floatingInput25').val('');

    };

    const clearItemDetails = () => {
        $('#floatingInput16').val('');
        $('#floatingInput17').val('');
        $('#floatingInput18').val('');
        $('#floatingInput19').val('');

    };

    const clearInvoiceDetails = () =>{

        $('#floatingInput11').val('');
        $('#floatingInput12').val('');
        $('#floatingInput13').val('');
        $('#floatingInput14').val('');
        $('#floatingInput15').val('');

    }

const clearTotalForm = () => {

    var totalBal = document.getElementById("total_bal");
    var customerPayed = document.getElementById("customer_payed");
    var lastBalance = document.getElementById("last_balance");
    const label = document.getElementById("total_big");

    totalBal.textContent = "";
    customerPayed.textContent = "";
    lastBalance.textContent = "";
    label.innerHTML = "";
    $('#customer_payment').val('');
    $('#floatingInput20').val('');
    $('#floatingInput30').val('');
};

function loadOrderItems(id, name, price, qty) {

    $('#items_in_order_table').empty();


    let tbl_row = `<tr><td class="item_id">${id}</td><td class="item_name">${name}</td><td class="unit_price">${price}</td><td class="qty">${qty}</td><td class="total">${price*qty}</td></tr>`;
    $('#items_in_order_table').append(tbl_row);
}


//place the order
$("#place_order_btn").on("click", () => {

    let id =  $('#floatingInput11').val();
    let date = $('#floatingInput12').val();
    let customerId = $('#floatingInput13').val();


    if (id) {

        if (date) {

            // loadOrders()

            let orderData = {
                id: id,
                date: date,
                balance:total,
                customer_id: customerId,
                items: orderItems
            };

            console.log(orderData);
            $.ajax({
                type: "POST",
                url: "http://localhost:8080/Pos_System_BackEnd/invoiceApi",
                contentType: "application/json",
                data: JSON.stringify(orderData),
                success: function(response) {
                    // Handle success response if needed
                    clearItemDetails()

                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Order Placed Successfully",
                        showConfirmButton: false,
                        timer: 1500
                    });

                    clearTotalForm();
                    clearInvoiceDetails()
                    $('#items_in_order_table').empty();
                    loadOrders();
                },
                error: function(xhr, status, error) {
                    // Handle error response if needed
                    console.error("Error placing order:", error);
                }
            });

        ;

        } else {
            toastr.error('Select Date First');

        }
    }else {
        toastr.error('Invalid Order Id');
    }

});


//load order details to the form when clicked table raw
$("#orders_table").on("click", "tr", function() {

    let rawIndex;
    rawIndex = $(this).index();

    let order_id =  $(this).find(".order_id").text();
    let customer_id = $(this).find(".customer_id").text();
    let customer_name = $(this).find(".customer_name").text();
    let date  = $(this).find(".date").text();
    let balance = $(this).find(".total").text();

    $('#floatingInput21').val(order_id);
    $('#floatingInput21').prop('disabled', true); // Disable the input field
    $('#floatingInput22').val(customer_id);
    $('#floatingInput23').val(customer_name);
    $('#floatingInput24').val(date);
    $('#floatingInput25').val(balance);

    $('#popupModelOrders .btn-close').click();

});


$('#order_search_input').on('input', () => {

    let orderId = $('#order_search_input').val();

    if (orderId){


        $.ajax({
            type: "GET",
            url: "http://localhost:8080/Pos_System_BackEnd/orderApi?orderId=" + orderId,
            contentType: "application/json",

            success: function (response) {

                console.log(response)

                 // Convert the date format from "Jan 1, 2024" to "yyyy-MM-dd"
                 var formattedDate = moment(response.date, "MMM D, YYYY").format("YYYY-MM-DD");

                $('#floatingInput21').val(response.id);
                $('#floatingInput24').val(formattedDate);
                $('#floatingInput25').val(response.balance);
                $('#floatingInput21').prop('disabled', true);
                $('#floatingInput22').prop('disabled', true);
                $('#floatingInput22').val(response.customer_id);
                $('#floatingInput23').val(response.name);
            },
            error: function (xhr, status, error) {
                toastr.error('Something Error');
            }
        });

        let results = orders.filter((order) =>

            order.order_id.toLowerCase().startsWith(orderId.toLowerCase())

        );

        results.map((order, index) => {

            $('#floatingInput22').val(order.customer_id);
            $('#floatingInput23').val(order.customer_name);

        });


    }else {
        toastr.error('Invalid Order Id');
    }
});

//update order details
$("#update_order").on("click", () => {

    Swal.fire({
        title: 'Do you want to update this order details?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'yes',
        denyButtonText: `no
        `,
    }).then((result) => {

        if (result.isConfirmed) {

            let id = $('#floatingInput21').val();
            let customer_nic = $('#floatingInput22').val();
            let customer_name = $('#floatingInput23').val();
            let date = $('#floatingInput24').val();
            let balance = $('#floatingInput25').val();

            if (id) {

                if (customer_name) {

                    if (date) {

                        if (balance) {


                            const updateOrder = {
                                id: id,
                                date: date,
                                balance: balance,
                                customer_id: customer_nic,
                                name: customer_name
                            }

                             // Create JSON
                             let orderJSON  = JSON.stringify(updateOrder);


                             $.ajax({
                                 type:"PUT",
                                 url:"http://localhost:8080/Pos_System_BackEnd/orderApi",
                                 contentType:"application/json",
                                 data:orderJSON,

                                 success: function (response) {
                                     Swal.fire(

                                         'Success!',
                                         'Order has been Updated successfully!',
                                         'success'

                                     );

                                     clearOrderUpdateForm();

                                     loadOrders();
                                 },
                                 error: function (xhr, status, error) {
                                          toastr.error('Something Error');
                                 }
                             });


                        } else {
                            toastr.error('Input the balance');
                        }
                    } else {
                        toastr.error('Input the date');
                    }
                } else {
                    toastr.error('Input the customer name');
                }

            } else {
                toastr.error('Input the customer id');
            }

        } else if (result.isDenied) {
            Swal.fire('Changes are not saved', '', 'info')
        }
    });
});
//remove the order
$("#remove_order").on("click", () => {

    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({

        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true

    }).then((result) => {
        if (result.isConfirmed) {


            let order_id = $("#floatingInput21").val();
            $.ajax({
                type: "DELETE",
                url: "http://localhost:8080/Pos_System_BackEnd/orderApi?orderId=" + order_id,
                contentType: "application/json",

                success: function (response) {

                     loadOrders();

                    swalWithBootstrapButtons.fire(
                        'Deleted!',
                        'Your file has been deleted.',
                        'success'
                    )

                    clearOrderUpdateForm()
                },
                error: function (xhr, status, error) {
                    toastr.error('Something Error');
                }
            });






        } else if (
            result.dismiss === Swal.DismissReason.cancel
        ) {
            swalWithBootstrapButtons.fire(
                'Cancelled',
                'Your imaginary file is safe :)',
                'error'
            )
        }
    })

});

//Add order details to the orders table
export const loadOrders = () => {

    $('#orders_table').empty();

    $.ajax({
        type: "GET",
        url: "http://localhost:8080/Pos_System_BackEnd/orderApi?orderId=" + "AllOrders",
        contentType: "application/json",

        success: function (response) {
                 response.map((order, index) => {

                     var formattedDate = moment(order.date, "MMM D, YYYY").format("YYYY-MM-DD");

                    let tbl_row = `<tr><td class="order_id">${order.id}</td><td class="customer_id">${order.customer_id}</td><td class="customer_name">${order.name}</td><td class="date">${formattedDate}</td><td class="total">${order.balance}</td></tr>`;
                     $('#orders_table').append(tbl_row);
                 });
        },
        error: function (xhr, status, error) {
                toastr.error('Something Error');
        }


    });

};

$("#order_link, #order_link1").on("click", () => {
    loadOrders();
});