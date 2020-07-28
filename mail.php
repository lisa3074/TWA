<?php
$firstname = $_POST['firstname'];
$email = $_POST['email'];
$message = $_POST['message'];
$formcontent ="Fra: $firstname \n Email: $email \n Besked: $message";
$recipient ="whitealbummusic@gmail.com";
$subject ="contact form";
$mailheader = "Fra: $email \r\n";
mail($recipient, $subject, $formcontent, $mailheader) or die("Error!");
echo "Tusind tak for din besked. Vi vender tilbage!";
?>


<style>
    body {
        background-color: #FCF9F6;
        text-align: center;
        font-family: sans-serif;
        font-size: 0.9rem;
        color: #403F3F;
    }

    .tibaws {
        height: 35px;
        width: 120px;
        text-align: center;
        background-color: #FCF9F6;
        top: 1.9rem;
        border-radius: 10px;
        border: 1px solid #FCF9F6;
        box-shadow: 0px 1px 5px 1px #aaaaaa;
        right: 12rem;
        z-index: 10;
        margin: 0 auto;
    }

    .tilbage,
    a {
        text-decoration: none;
        font-family: sans-serif;
        font-size: 0.9rem;
        color: rgba(64, 63, 63, 0.81);
        padding: 0.6rem 0;
        margin: 0;
        font-weight: 400;
    }

    .wrap {
        width: 100%;
    }

</style>
<br><br><br>
<div class="wrap">
    <a href="kontakt.html">
        <div class="tibaws">
            <p class="tilbage">TILBAGE</p>
        </div>
    </a>
</div>
