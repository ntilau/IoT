<?php
require_once __DIR__.'/vendor/autoload.php';
session_start();
$date = date("Y/m/d");
$client = new Google_Client();
$client->setAuthConfig('client_secrets.json');
$client->addScope(Google_Service_Oauth2::USERINFO_PROFILE);
$client->addScope(Google_Service_Oauth2::USERINFO_EMAIL);
$client->setAccessType('offline');
//$client->refreshTokenWithAssertion($cred);

if (isset($_SESSION['access_token']) && $_SESSION['access_token']) {
  $client->refreshToken($_SESSION['access_token']);
  $client->setAccessToken($_SESSION['access_token']);
  $access_token = $_SESSION['access_token']['access_token'];
  //$q = 'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token='.$access_token;
  //$json = file_get_contents($q);
  //$data = json_decode($json);
  $google_oauthV2 = new Google_Service_Oauth2($client);
  $user_email = $google_oauthV2->userinfo->get()->email;
  $user_givenName = $google_oauthV2->userinfo->get()->givenName;
  $user_familyName = $google_oauthV2->userinfo->get()->familyName;
  $user_nickName = $google_oauthV2->userinfo->get()->nickName;
  $user_name = $google_oauthV2->userinfo->get()->name;
  $user_gender = $google_oauthV2->userinfo->get()->gender;
  $user_link = $google_oauthV2->userinfo->get()->link;
  $user_picture = $google_oauthV2->userinfo->get()->picture; //profile picture
  $user_file = fopen("core/prof/".$user_email, "w") or die("Unable to open file!");
  fwrite($user_file, "{\n\"name\": \"".$user_name."\",\n\"picture\": \"".$user_picture."\"\n}");
  fclose($user_file);
  //echo '<img src='.$user_picture.'?sz=300><p>'.$data->access_type.'</p>';
  //echo json_encode($google_oauthV2->userinfo->get());
} else {
  $redirect_uri = 'http://' . $_SERVER['HTTP_HOST'] . '/oauth2callback.php';
  header('Location: ' . filter_var($redirect_uri, FILTER_SANITIZE_URL));
}
?>
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" href="favicon.ico">
    <script type="text/javascript" src=https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js></script>
    <link rel="stylesheet" href="https://unpkg.com/onsenui/css/onsenui.css">
    <link rel="stylesheet" href="https://unpkg.com/onsenui/css/onsen-css-components.min.css">
    <script type="text/javascript" src="https://unpkg.com/onsenui/js/onsenui.min.js"></script>
    <title>Cross'd</title>
    <style>
        .pull-hook-content {
            color: #666;
            transition: transform .25s ease-in-out;
        }
    </style>
</head>
<body style="position: fixed">
    <script> 
        var tryGeolocation = function() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    function(position) {
                        var url = "https://www.google.com/maps/embed/v1/place?key=AIzaSyCm6JXpmr14wVdidMw4zwo9BCFTkaHql-4&q=" + 
                            position.coords.latitude + "," + position.coords.longitude + "&zoom=15";
                        document.getElementById("map_location").setAttribute("src", url);
                        document.getElementById("map_dialog").show();
                    }, function(error) {
                        switch (error.code) {
                            case error.TIMEOUT:
                                ons.navigator.alert("Browser geolocation error !\n\nTimeout.");
                                break;
                            case error.PERMISSION_DENIED:
                                ons.navigator.alert("Browser geolocation error !\n\nPermission denied.");
                                break;
                            case error.POSITION_UNAVAILABLE:
                                ons.navigator.alert("Browser geolocation error !\n\nPosition unavailable.");
                                break;
                        }
                    }, 
                    {maximumAge: 60000, timeout: 60000, enableHighAccuracy: true}
                );
            }
        };
        tryGeolocation();
    </script>
    <ons-navigator id="appNavigator">
        <ons-page>
            <ons-splitter id="appSplitter">
                <ons-splitter-content id="peers" page="peers.html"></ons-splitter-content>
                <ons-splitter-side id="photo" page="photo.html" swipeable side="left" collapse="" width="100%" animation="push" swipe-target-width="100%"></ons-splitter-side>
                <ons-splitter-side id="message" page="message.html" swipeable side="right" collapse="" width="100%" animation="push" swipe-target-width="100%"></ons-splitter-side>
            </ons-splitter>
        </ons-page>
    </ons-navigator>
    <ons-tabbar swipeable position="auto">
        <ons-tab page="photo.html" label="Profile" icon="ion-home, material:md-home"></ons-tab>
        <ons-tab page="peers.html" label="Peers" icon="ion-person-stalker" active-icon="ion-person-add" active></ons-tab>
        <ons-tab page="message.html" label="Chat" icon="ion-chatbubbles" active-icon="ion-chatbubble-working" badge="1"></ons-tab>
        <!-- badge -->
    </ons-tabbar>
    <template id="peers.html">
        <ons-page id="peers_page">
            <ons-pull-hook id="peers_hook" threshold-height="120px">
            <ons-icon id="peers_pull-hook-icon" size="22px" class="pull-hook-content" icon="fa-arrow-down"></ons-icon>
            </ons-pull-hook>
            <ons-row style="width:100%; max-width: 600px; margin: auto">
            <ons-col>            
            <ons-card style="margin: 0; padding:5px">
                <img id="user_picture" src="<?php echo $user_picture ?>?sz=290" alt="<?php echo $user_name ?>" style="width: 100%">
                </ons-card>
            </ons-col>
            <ons-col>
            <ons-card style="margin: 0; padding:5px">
                <img id="user_picture" src="<?php echo $user_picture ?>?sz=290" alt="<?php echo $user_name ?>" style="width: 100%">
                </ons-card></ons-col>
            </ons-row>
            <ons-row style="width:100%; max-width: 600px; margin: auto">
            <ons-col>            
            <ons-card style="margin: 0; padding:5px">
                <img id="user_picture" src="<?php echo $user_picture ?>?sz=290" alt="<?php echo $user_name ?>" style="width: 100%">
                </ons-card>
            </ons-col>
            <ons-col>
            <ons-card style="margin: 0; padding:5px">
                <img id="user_picture" src="<?php echo $user_picture ?>?sz=290" alt="<?php echo $user_name ?>" style="width: 100%">
                </ons-card></ons-col>
            </ons-row>
            <ons-row style="width:100%; max-width: 600px; margin: auto">
            <ons-col>            
            <ons-card style="margin: 0; padding:5px">
                <img id="user_picture" src="<?php echo $user_picture ?>?sz=290" alt="<?php echo $user_name ?>" style="width: 100%">
                </ons-card>
            </ons-col>
            <ons-col>
            <ons-card style="margin: 0; padding:5px">
                <img id="user_picture" src="<?php echo $user_picture ?>?sz=290" alt="<?php echo $user_name ?>" style="width: 100%">
                </ons-card></ons-col>
            </ons-row>
            <ons-row style="width:100%; max-width: 600px; margin: auto">
            <ons-col>            
            <ons-card style="margin: 0; padding:5px">
                <img id="user_picture" src="<?php echo $user_picture ?>?sz=290" alt="<?php echo $user_name ?>" style="width: 100%">
                </ons-card>
            </ons-col>
            <ons-col>
            <ons-card style="margin: 0; padding:5px">
                <img id="user_picture" src="<?php echo $user_picture ?>?sz=290" alt="<?php echo $user_name ?>" style="width: 100%">
                </ons-card></ons-col>
            </ons-row>
            <script>
                ons.getScriptPage().onInit = function () {
                    var peersPullHook = document.getElementById('peers_hook');
                    var icon = document.getElementById('peers_pull-hook-icon');
                    peersPullHook.addEventListener('changestate', function (event) {
                        switch (event.state) {
                            case 'initial':
                            icon.setAttribute('icon', 'fa-arrow-down');
                            icon.removeAttribute('rotate');
                            icon.removeAttribute('spin');
                            break;
                            case 'preaction':
                            icon.setAttribute('icon', 'fa-arrow-down');
                            icon.setAttribute('rotate', '180');
                            icon.removeAttribute('spin');
                            break;
                            case 'action':
                            icon.setAttribute('icon', 'ion-load-d');
                            icon.removeAttribute('rotate');
                            icon.setAttribute('spin', true);
                            break;
                        }
                    });
                    peersPullHook.onAction = function (done) {
                        setTimeout(function() {
                            done();
                        }, 500);
                    }
                };
            </script>
        </ons-page>
    </template>
    <template id="photo.html">
        <ons-page id="photo_page">
            <ons-pull-hook id="photo_hook" threshold-height="120px">
            <ons-icon id="photo_pull-hook-icon" size="22px" class="pull-hook-content" icon="fa-arrow-down"></ons-icon>
            </ons-pull-hook>
            <!--div class="background" style="background-color: black;"></div-->
            <!--div class="content" id="photo_content" style="display:flex; align-items: center; vertical-align: middle; width: 99%; margin: .5%;"-->
            <ons-card style="max-width: 600px; margin: auto">
                <div class="title" style="position: relative; text-align: center; color: white;">
                    <img id="user_picture" src="<?php echo $user_picture ?>?sz=580" alt="<?php echo $user_name ?>" style="width: 100%" onclick="window.open('https://aboutme.google.com/?referer=gplus','_blank')">
                    <div style="position: absolute; bottom: 8px; left: 16px;">
                        <?php echo $user_name ?>
                    </div>
                </div>
                <div class="content">
                    <ons-list>
                        <ons-list-header>Filters</ons-list-header>
                        <ons-list-item>...</ons-list-item>
                    </ons-list>
                </div>
            </ons-card>
            <!--/div-->
            <script>
                ons.getScriptPage().onInit = function () {
                    var photoPullHook = document.getElementById('photo_hook');
                    var icon = document.getElementById('photo_pull-hook-icon');
                    photoPullHook.addEventListener('changestate', function (event) {
                        switch (event.state) {
                            case 'initial':
                            icon.setAttribute('icon', 'fa-arrow-down');
                            icon.removeAttribute('rotate');
                            icon.removeAttribute('spin');
                            break;
                            case 'preaction':
                            icon.setAttribute('icon', 'fa-arrow-down');
                            icon.setAttribute('rotate', '180');
                            icon.removeAttribute('spin');
                            break;
                            case 'action':
                            icon.setAttribute('icon', 'ion-load-d');
                            icon.removeAttribute('rotate');
                            icon.setAttribute('spin', true);
                            break;
                        }
                    });
                    photoPullHook.onAction = function (done) {
                        setTimeout(function() {
                            tryGeolocation();
                            done();
                        }, 500);
                    }
                };

            </script>
        </ons-page>
    </template>
    <template id="message.html">
        <ons-page id="message_page">
            <ons-pull-hook id="message_hook" threshold-height="120px">
            <ons-icon id="message_pull-hook-icon" size="22px" class="pull-hook-content" icon="fa-arrow-down"></ons-icon>
            </ons-pull-hook>
            <!--div class="background" style="background-color: black;"></div-->
            <!--div class="content" id="message_content" style="vertical-align: top; height:inherit; width: inherit; padding-left:5px;padding-right:5px; padding-top:5px"></div-->
            <!--ons-bottom-toolbar style="background-color:inherit; height: 45px; margin:0px !important; padding:0px !important; border:0px" modifier="transparent">
                <div style="background-color:#DDD; border-radius: 8px; vertical-align:middle; height: 24px; width: inherit; margin: 5px; padding:5px;">
                    <ons-input type="text" id="msg" placeholder="" onclick="setTimeout(app.xShowChat,750)" onkeypress="app.xSendMsg(event)" modifier="material" style="width: 100%; vertical-align:middle;"></ons-input>
                </div>
            </ons-bottom-toolbar--> 
            <ons-list style="width:100%; max-width: 600px; margin: auto">
            <ons-list-item>
            <div class="left">
                <img class="list-item__thumbnail" src="<?php echo $user_picture ?>?sz=200">
            </div>
            <div class="center">
                <span class="list-item__title"><?php echo $user_name ?></span><span class="list-item__subtitle"><?php echo $user_email ?></span>
            </div>
            </ons-list-item>
            </ons-list>
            <script>
                ons.getScriptPage().onInit = function () {
                    var messagePullHook = document.getElementById('message_hook');
                    var icon = document.getElementById('message_pull-hook-icon');
                    messagePullHook.addEventListener('changestate', function (event) {
                        switch (event.state) {
                            case 'initial':
                            icon.setAttribute('icon', 'fa-arrow-down');
                            icon.removeAttribute('rotate');
                            icon.removeAttribute('spin');
                            break;
                            case 'preaction':
                            icon.setAttribute('icon', 'fa-arrow-down');
                            icon.setAttribute('rotate', '180');
                            icon.removeAttribute('spin');
                            break;
                            case 'action':
                            icon.setAttribute('icon', 'ion-load-d');
                            icon.removeAttribute('rotate');
                            icon.setAttribute('spin', true);
                            break;
                        }
                    });
                    messagePullHook.onAction = function (done) {
                        setTimeout(function() {
                            done();
                        }, 500);
                    }
                };
            </script>
        </ons-page>
    </template>
    <ons-dialog id="map_dialog" style="width:100%; height:100vh;" cancelable>
        <ons-card style="padding:5px; margin:0; width:auto; height:auto">
            <iframe id="map_location" width="100%" height="100%" style="border:0" frameborder="0" src="" allowfullscreen></iframe>
        </ons-card>
    </ons-dialog>
    <ons-dialog id="peer_dialog" cancelable>
        <ons-card style="padding:5px; margin:0">
            <img id="peer_image" src="" style="vertical-align: middle; width: 100%" />
        </ons-card>
    </ons-dialog>
    <ons-modal id="load_modal">
        <ons-icon size="35px" spin="true" icon="ion-load-d"></ons-icon>
    </ons-modal>
</body>
</html>