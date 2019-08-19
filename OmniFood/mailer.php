<?php

    $name = strip_tags(trim($_POST["name"]));
    $name = str_replace(array("\r", "\n"), array(" ", " "), $name);
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $message = trim($_POST["message"]);
    
    if(empty($name) OR empty($message) OR !filter_var($email), FILTER_VALIDATE_EMAIL)) {
        header("Location: http://i386998.hera.fhict.nl/HTML%20+%20CSS/OmniFood/index.php?success=-1#form");
        exit;
    }

    