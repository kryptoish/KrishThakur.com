document.addEventListener("DOMContentLoaded", function() {
    // Encoded email address
    var encodedEmail = "&#107;&#116;&#104;&#97;&#107;&#117;&#48;&#50;&#64;&#115;&#116;&#117;&#100;&#101;&#110;&#116;&#46;&#117;&#98;&#99;&#46;&#99;&#97;";
    
    // Decode the email address
    var email = encodedEmail.replace(/&#(\d+);/g, function(match, dec) {
        return String.fromCharCode(dec);
    });
    
    // Find the existing anchor element
    var mailtoLink = document.getElementById("email-link");
    
    // Set the href attribute to the mailto link
    mailtoLink.href = "mailto:" + email;
});