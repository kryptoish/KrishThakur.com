document.addEventListener("DOMContentLoaded", function() {
    // Encoded email address
    var encodedEmail = "&#107;&#114;&#105;&#115;&#104;&#116;&#104;&#97;&#107;&#117;&#114;&#64;&#114;&#117;&#110;&#105;&#120;&#46;&#99;&#108;&#111;&#117;&#100;";
    
    // Decode the email address
    var email = encodedEmail.replace(/&#(\d+);/g, function(match, dec) {
        return String.fromCharCode(dec);
    });
    
    // Find the existing anchor element
    var mailtoLink = document.getElementById("email-link");
    
    // Set the href attribute to the mailto link
    mailtoLink.href = "mailto:" + email;
});