/* global $, sessionStorage, document, jQuery */

import updateShoppingCartView from "./headerController.js";

// Add method to verify credit card expiry date
// @ts-ignore
jQuery.validator.addMethod("expiry", function(value, element) {
    return this.optional(element) || /^(0[1-9]|1[0-2])\/[0-9]{2}$/.test( value );
}, "La date d'expiration de votre carte de crédit est invalide.");

// Set validation rules for order form
$(function() {
    // @ts-ignore
    $("#order-form").validate({
        rules: {
            "first-name": {
                required: true,
                minlength: 2
            },
            "last-name": {
                required: true,
                minlength: 2
            },
            email: {
                required: true,
                email: true
            },
            phone: {
                required: true,
                phoneUS: true
            },
            "credit-card": {
                required: true,
                creditcard: true
            },
            "credit-card-expiry": {
                required: true,
                expiry: true
            }
        },
        submitHandler: function(form) {
            // Set storage values to use in order confirmation page
            sessionStorage.setItem("firstName", document.forms["order-form"]["first-name"].value);
            sessionStorage.setItem("lastName", document.forms["order-form"]["last-name"].value);
            const formNumber = sessionStorage.getItem("formNumber") === null ? 1 : parseInt(sessionStorage.getItem("formNumber")) + 1;
            sessionStorage.setItem("formNumber", formNumber.toString());
            sessionStorage.setItem("shoppingCartItems", JSON.stringify([]));
            updateShoppingCartView();
            form.submit();
        }
    });
});

// Show order details
updateCommande();

function updateCommande() {
    $("#name").html("Votre commande est confirmée ".concat(sessionStorage.getItem("firstName")).concat(" ").concat(sessionStorage.getItem("lastName")).concat("!"));
    $("#confirmation-number").html("Votre numéro de confirmation est le <strong>".concat(sessionStorage.getItem("formNumber")).concat("</strong>."));
}

