var itemNamePattern = new RegExp("^[A-Z][A-Za-z0-9]*([-_ ]?[A-Za-z0-9]+)*$");
var pricePattern = /^(\d+(\.\d{1,2})?)$/;

$("#add_item_btn").click(function (event) {

    event.preventDefault();

    var id = $("#itemId").val();
    var qty = $("#itemQty").val();
    var name = $("#itemName").val();
    var exp = $("#itemExpDate").val();
    var price = $("#itemSize").val();

    if(id) {

        if(qty) {

            let isValid = itemNamePattern.test(name);

            if(name && isValid) {

                if(exp) {

                    let isPriceValid = pricePattern.test(price)

                    if (price && isPriceValid){

                            // Create an object to accumulate data
                            const newItem = {
                                id: id,
                                qty: qty,
                                name: name,
                                exp: exp,
                                price: price
                            }


                            // Create JSON
                            let itemJSON = JSON.stringify(newItem);

                            console.log(itemJSON);


                            $.ajax({
                                type:"POST",
                                url:"http://localhost:8080/Pos_System_BackEnd/itemApi",
                                contentType:"application/json",
                                data:itemJSON,

                                success:function (response){
                                    Swal.fire(
                                        'Success!',
                                        'Item has been saved successfully!',
                                        'success'
                                    );

                                    loadItems();
                                    cleanAddForm();
                                },
                                error: function(xhr, status, error){
                                    toastr.error('Something Error');
                                }
                            });

                    }else {
                        toastr.error('Input Item Price');
                    }

                } else {
                    toastr.error('Input Item Exp Date');
                }

            } else {
                toastr.error('Invalid Item Name');
            }

        } else {
            toastr.error('Input Item Qty');
        }

    } else {
        toastr.error('Invalid Item Id');
    }


});

const cleanAddForm = () => {
    $('#itemId').val('');
    $('#itemQty').val('');
    $('#itemName').val('');
    $('#itemExpDate').val('');
    $('#itemSize').val('');

};
const cleanUpdateForm = () => {
    $('#floatingInput').val('');
    $('#floatingInput2').val('');
    $('#floatingInput3').val('');
    $('#floatingInput4').val('');
    $('#inputGroupSelect01').val('');

};

$('#clear_item_btn').on('click', () => {

    cleanAddForm();

});

$('#itemId').on('input', () => {

    let id = $('#itemId').val();

    $.ajax({
        type: "GET",
        url: "http://localhost:8080/Pos_System_BackEnd/itemApi?itemId=" + id,
        contentType: "application/json",

        success: function (response) {

           if (Object.keys(response).length  > 0) {

                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'The Item already exist. Please use update option',
                })

                $('#itemId').val("");


            } else {



            }

        },
        error: function (xhr, status, error) {
        }
    });
});

$('#search_item').on('input', () => {

        let id = $('#search_item').val();

        $.ajax({
            type: "GET",
            url: "http://localhost:8080/Pos_System_BackEnd/itemApi?itemId=" + id,
            contentType: "application/json",

            success: function (response) {

                // Convert the date format from "Jan 1, 2024" to "yyyy-MM-dd"
                var formattedDate = moment(response.exp, "MMM D, YYYY").format("YYYY-MM-DD");


                $('#floatingInput').val(response.id);
                $('#floatingInput').prop('disabled', true); // Disable the input field
                $('#floatingInput2').val(response.qty);
                $('#floatingInput3').val(response.name);
                $('#floatingInput4').val(formattedDate);
                $('#inputGroupSelect01').val(response.price);

                $('#search_item').val("");

            },
            error: function (xhr, status, error) {
                toastr.error('Something Error');
            }
        });

});

    $("#item_update_btn").on("click", () => {


        Swal.fire({
            title: 'Do you want to update this item?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'yes',
            denyButtonText: `no
        `,
        }).then((result) => {

            if (result.isConfirmed) {

                let id = $('#floatingInput').val();
                let qty = $('#floatingInput2').val();
                let name = $('#floatingInput3').val();
                let exp = $('#floatingInput4').val();
                let price = $('#inputGroupSelect01').val();
                if (qty) {

                    let isValid = itemNamePattern.test(name);

                    if (name && isValid) {

                        if (exp) {

                            let isPriceValid = pricePattern.test(price)

                            if (price && isPriceValid) {

                                // Create an object to accumulate data
                                const updatedItem = {
                                    id: id,
                                    qty: qty,
                                    name: name,
                                    exp: exp,
                                    price: price
                                }


                                // Create JSON
                                let itemJSON = JSON.stringify(updatedItem);

                                console.log(itemJSON);


                                $.ajax({
                                    type: "PUT",
                                    url: "http://localhost:8080/Pos_System_BackEnd/itemApi",
                                    contentType: "application/json",
                                    data: itemJSON,

                                    success: function (response) {
                                        Swal.fire(
                                            'Success!',
                                            'Item has been Updated successfully!',
                                            'success'
                                        );

                                        loadItems();
                                        cleanUpdateForm();
                                    },
                                    error: function (xhr, status, error) {
                                        toastr.error('Something Error');
                                    }
                                });

                            } else {
                                toastr.error('Input Item Price');
                            }
                        } else {
                            toastr.error('Input Item Exp Date');
                        }

                    } else {
                        toastr.error('Invalid Item Name');
                    }

                } else {
                    toastr.error('Input Item Qty');

                }


            } else if (result.isDenied) {
                Swal.fire('Changes are not saved', '', 'info')
            }
        });
    });
    $("#item_delete_btn").on("click", () => {

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

                let id = $("#floatingInput").val();

                $.ajax({
                    type: "DELETE",
                    url: "http://localhost:8080/Pos_System_BackEnd/itemApi?itemId=" + id,
                    contentType: "application/json",

                    success: function (response) {
                        swalWithBootstrapButtons.fire(
                            'Deleted!',
                            'Your file has been deleted.',
                            'success'
                        )

                        loadItems();
                        cleanUpdateForm();
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
        });
    });
$("#item_link, #item_link1").on("click", () => {
    loadItems();
});
export const loadItems = () => {

    $('#itemsTableBody').empty();

    $.ajax({
        type: "GET",
        url: "http://localhost:8080/Pos_System_BackEnd/itemApi?itemId=" + "AllItems",
        contentType: "application/json",

        success: function (response) {



            response.map((item, index) => {

                // Convert the date format from "Jan 1, 2024" to "yyyy-MM-dd"
                var formattedDate = moment(item.exp, "MMM D, YYYY").format("YYYY-MM-DD");

                let tbl_row = `<tr><td class="item_id">${item.id}</td><td class="item_name">${item.name}</td><td class="item_qty">${item.qty}</td><td class="item_exp_date">${formattedDate}</td><td class="item_size">${item.price}</td></tr>`;
                $('#itemsTableBody').append(tbl_row);

            });
        },

        error: function (xhr, status, error) {
            toastr.error('Something Error');
        }
    });

};
