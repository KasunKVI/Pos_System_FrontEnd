//Send Customer Details to backend

var nicPattern = /^(19[2-9]\d|20[0-1]\d)\d{8}|^[2-9]\d{8}V$/;
var namePattern = /^[A-Za-z '-]+$/;
var contactNumberPattern = /^(070|071|076|077|072|078|075|074)\d{7}$/;
var emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

$("#add_customer_btn").click(function (event) {



    event.preventDefault();

    var id = $("#customerId").val();
    var name = $("#customerName").val();
    var mobile_no = $("#customerContact").val();
    var dob = $("#customerDob").val();
    var email = $("#customerEmail").val();
    var gender = $("input[name='flexRadioDefault']:checked").val();
    var address = $("#customerAddress").val();


    let isIdValid = nicPattern.test(id);

    if(id && isIdValid) {

        let isNameValid = namePattern.test(name);

        if(name && isNameValid) {

            let isValidContact = contactNumberPattern.test(mobile_no);

            if(mobile_no && isValidContact) {

                if(dob) {

                    let isValidEmail = emailPattern.test(email);

                    if (email && isValidEmail){

                        if (gender){

                                // Create an object to accumulate data
                                const newCustomer = {
                                    id: id,
                                    name: name,
                                    mobile_no: mobile_no,
                                    dob: dob,
                                    email: email,
                                    gender: gender,
                                    address: address
                                }



                                // Create JSON
                                let customerJSON = JSON.stringify(newCustomer);


                                $.ajax({
                                    type:"POST",
                                    url:"http://localhost:8080/Pos_System_BackEnd/customerApi",
                                    contentType:"application/json",
                                    data:customerJSON,

                                    success:function (response){
                                        Swal.fire(
                                            'Success!',
                                            'Customer has been saved successfully!',
                                            'success'
                                        );
                                        loadCustomers();
                                        cleanAddForm();
                                    },
                                    error: function(xhr, status, error){
                                        toastr.error('Something Error');
                                    }
                                });
                        }else {
                            toastr.error('Input Gender Please');
                        }
                    }else {
                        toastr.error('Invalid Email Address');
                    }
                }else {
                    toastr.error('Input Dob Please');
                }
            }else {
                toastr.error('Enter A Valid Mobile');
            }
        }else {
            toastr.error('Invalid Customer Name');
        }
    } else {
        toastr.error('Invalid Customer Id');
    }



});

const cleanAddForm = () => {
    $('#customerId').val('');
    $('#customerName').val('');
    $('#customerContact').val('');
    $('#customerDob').val('');
    $('#customerEmail').val('');
    $(`input[name='flexRadioDefault']`).prop("checked", false);
    $('#customerAddress').val('');


};

const cleanUpdateForm = () => {

    $('#floatingInput5').val('');
    $('#floatingInput6').val('');
    $('#floatingInput7').val('');
    $('#floatingInput8').val('');
    $('#floatingInput9').val('');
    $(`input[name='flexRadioDefault1']`).prop("checked", false);
    $('#floatingInput10').val('');


};

$('#clear_customer_btn').on('click', () => {
    cleanAddForm();
});

$('#customerId').on('input', () => {

    let id = $('#customerId').val();

    $.ajax({
        type: "GET",
        url: "http://localhost:8080/Pos_System_BackEnd/customerApi?customerId=" + id,
        contentType: "application/json",

        success: function (response) {

            if (Object.keys(response).length > 0) {

                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'The Customer already exist. Please use update option',
                })

                $('#customerId').val("");

            } else {


            }
        },
        error: function (xhr, status, error) {
        }
    });
});
$('#search_customer').on('input', () => {


    let id = $('#search_customer').val();

    $.ajax({
        type: "GET",
        url: "http://localhost:8080/Pos_System_BackEnd/customerApi?customerId=" + id,
        contentType: "application/json",

        success: function (response) {

            console.log(response)

            var formattedDate = moment(response.dob, "MMM D, YYYY").format("YYYY-MM-DD");

            $('#floatingInput5').val(id);
            $('#floatingInput5').prop('disabled', true); // Disable the input field
            $('#floatingInput6').val(response.name);
            $('#floatingInput7').val("0"+response.mobile_no);
            $('#floatingInput8').val(formattedDate);
            $('#floatingInput9').val(response.email);
            $('input[name="flexRadioDefault1"][value="' + response.gender + '"]').prop('checked', true);
            $('#floatingInput10').val(response.address);

            $('#search_customer').val("");


        },
        error: function (xhr, status, error) {
            toastr.error('Something Error');
        }
    });
})

$("#customer_link1, #customer_link").on("click", () => {
    loadCustomers();
});
$("#update_customer_btn").on("click", () => {



    Swal.fire({
        title: 'Do you want to update this customer?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'yes',
        denyButtonText: `no
        `,
    }).then((result) => {

        if (result.isConfirmed) {

            let id = $('#floatingInput5').val();
            let name = $('#floatingInput6').val();
            let mobile_no = $('#floatingInput7').val();
            let dob = $('#floatingInput8').val();
            let email = $('#floatingInput9').val();
            let gender = $('input[name="flexRadioDefault1"]:checked').val();
            let address = $('#floatingInput10').val();

            let isNameValid = namePattern.test(name);

            if(name && isNameValid) {

                let isValidContact = contactNumberPattern.test(mobile_no);

                if(mobile_no && isValidContact) {

                    if(dob) {

                        let isValidEmail = emailPattern.test(email);

                        if (email && isValidEmail){

                            if (gender){

                                // Create an object to accumulate data
                                const updateCustomer = {
                                    id: id,
                                    name: name,
                                    mobile_no: mobile_no,
                                    dob: dob,
                                    email: email,
                                    gender: gender,
                                    address: address
                                }



                                // Create JSON
                                let customerJSON = JSON.stringify(updateCustomer);


                                $.ajax({
                                    type:"PUT",
                                    url:"http://localhost:8080/Pos_System_BackEnd/customerApi",
                                    contentType:"application/json",
                                    data:customerJSON,

                                success: function (response) {

                                        Swal.fire(
                                            'Success!',
                                            'Customer has been Updated successfully!',
                                            'success'
                                        );

                                        loadCustomers();
                                        cleanUpdateForm();
                                },
                                error: function (xhr, status, error) {
                                        toastr.error('Something Error');
                                }

                                });


                            }else {
                                toastr.error('Input Gender Please');
                            }
                        }else {
                            toastr.error('Invalid Email Address');
                        }
                    }else {
                        toastr.error('Input Dob Please');
                    }
                }else {
                    toastr.error('Invalid Mobile Number');
                }
            }else {
                toastr.error('Invalid Customer Name');
            }

        } else if (result.isDenied) {
            Swal.fire('Changes are not saved', '', 'info')
        }
    })
});

$("#delete_customer_btn").on("click", () => {

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

            let id = $("#floatingInput5").val();

            $.ajax({
                type: "DELETE",
                url: "http://localhost:8080/Pos_System_BackEnd/customerApi?customerId=" + id,
                contentType: "application/json",

                success: function (response) {
                    swalWithBootstrapButtons.fire(
                        'Deleted!',
                        'Your file has been deleted.',
                        'success'
                    )

                    loadCustomers();
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
    })

});

const loadCustomers = () => {

    $('#customerTableBody').empty();

    $.ajax({
        type: "GET",
        url: "http://localhost:8080/Pos_System_BackEnd/customerApi?customerId=" + "AllCustomers",
        contentType: "application/json",

        success: function (response) {


            response.map((customer, index) => {
                let tbl_row = `<tr><td class="customer_id">${customer.nic}</td><td class="customer_name">${customer.name}</td><td class="customer_contact_no">${customer.mobile_no}</td><td class="customer_dob">${customer.dob}</td><td class="customer_email">${customer.email}</td><td class="customer_gender">${customer.gender}</td><<td class="customer_address">${customer.address}</td>/tr>`;
                $('#customerTableBody').append(tbl_row);
            });


        },
        error: function (xhr, status, error) {
            toastr.error('Something Error');
        }
    });



};