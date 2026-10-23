var user = {};
var mac = {};
var current_toid = "";
var displayed = [];
var chat_interval_id;

function arr_diff(a1, a2) {
    var a = [],
        diff = [];
    for (var i = 0; i < a1.length; i++) {
        a[a1[i]] = true;
    }
    for (var i = 0; i < a2.length; i++) {
        if (a[a2[i]]) {
            delete a[a2[i]];
        } else {
            a[a2[i]] = true;
        }
    }
    for (var k in a) {
        diff.push(k);
    }
    return diff;
}

// generic configuration parameters
var server = "http://ec2-13-58-95-129.us-east-2.compute.amazonaws.com/";
var restore_key = "CrOsS";
var service_uuid = "76202B97-51E8-40BC-B6F7-B7D440935FFE";
var service_characteristic = "51001225-1CF0-475F-93DB-D61B38200898";
var chat_data = "";

// application handler
var app = {
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        document.addEventListener('pause', this.onPause.bind(this), false);
        document.addEventListener('resume', this.onResume.bind(this), false);
    },
    onDeviceReady: function() {
        document.getElementById('load_modal').show();
        document.getElementById('photo').addEventListener('preopen', app.xSelfie, false);
        $(document).on('changestate', '#peers_hook', function(event) {
            if (event.originalEvent.state == 'action')
                app.xUpdatePeers();
        });
        $(document).on('changestate', '#peer_hook', function(event) {
            if (event.originalEvent.state == 'action') {
                document.getElementById('peer_image').setAttribute('src',
                    document.getElementById("peer_" + current_toid + "_image").src);
                document.getElementById('peer_image').setAttribute('onclick', 'app.xRemovePeer()');
                document.getElementById('peer_dialog').show();
            }
        });
        if(ons.platform.isAndroid() || ons.platform.isIOS())
        window.plugins.uniqueDeviceID.get(function(uuid) {
            $.ajax({
                type: "POST",
                url: server + "api.php",
                data: "&device=" + uuid + "&getprf=",
                crossDomain: true,
                cache: false,
                success: function(data) {
                    user = JSON.parse(data);
                    user.peers = JSON.parse(user.peers);
                    user.msgs = JSON.parse(user.msgs);
                    document.getElementById("image").setAttribute('src', user.image);
                    document.getElementById("image").setAttribute('onclick', "app.xRemovePrf()");
                    if (user.id != "") {
                        app.xUpdatePeers();
                        app.bleInit();
                    } else {
                        ons.notification.alert("Could not retreive ID on Cross server! Shutting down...");
                        navigator.app.exitApp();
                    }
                    document.getElementById('load_modal').hide();
                },
                error: function(data) {
                    ons.notification.alert({
                        message: 'Could not reach Cross server! Please check connection status. Shutting down...',
                        callback: function() { navigator.app.exitApp(); }
                    });
                }
            });
        }, function(error) {
            ons.notification.alert("Could not retrieve device identifier! Shutting down...");
            navigator.app.exitApp();
        });
        else
        uuid = '';
        $.ajax({
            type: "POST",
            url: server + "api.php",
            data: "&device=D42B9FE8-1F4B-46D9-9A96-C0F8015A707A&getprf=",
            crossDomain: true,
            cache: false,
            success: function(data) {
                user = JSON.parse(data);
                user.peers = JSON.parse(user.peers);
                user.msgs = JSON.parse(user.msgs);
                document.getElementById("image").setAttribute('src', user.image);
                document.getElementById("image").setAttribute('onclick', "app.xRemovePrf()");
                if (user.id != "") {
                    app.xUpdatePeers();
                    app.bleInit();
                } else {
                    ons.notification.alert("Could not retreive ID on Cross server! Shutting down...");
                    navigator.app.exitApp();
                }
                document.getElementById('load_modal').hide();
            },
            error: function(data) {
                ons.notification.alert({
                    message: 'Could not reach Cross server! Please check connection status. Shutting down...',
                    callback: function() { navigator.app.exitApp(); }
                });
            }
        });
    },
    onPause: function() {
        if (document.getElementById('message').hasAttribute("swipeable")) {
            clearInterval(chat_interval_id);
            document.getElementById('message').removeAttribute('swipeable');
            document.getElementById('message').close();
            current_toid = "";
        }
    },
    onResume: function() {
        app.xUpdatePeers();
    },
    xSelfie: function() {
        setTimeout(function() { document.getElementById('photo').close(); }, 1000);
        navigator.camera.getPicture(function(imageData) {
            user.image = "data:image/jpeg;base64," + imageData;
            $.ajax({
                type: "POST",
                url: server + "api.php",
                data: "id=" + user.id + "&image=" + user.image + "&setprf=",
                crossDomain: true,
                cache: false,
                beforeSend: function() {
                    ons.notification.toast({ message: '<div style="text-align:center">UPDATING PHOTO</div>', timeout: 5000 })
                },
                success: function(data) {
                    user = JSON.parse(data);
                    user.peers = JSON.parse(user.peers);
                    user.msgs = JSON.parse(user.msgs);
                    document.getElementById('image').setAttribute('src', user.image);
                    document.getElementById('image_dialog').show();
                },
                error: function() {
                    ons.notification.alert('Could not upload photo!');
                }
            });
        }, function(error) {
            document.getElementById('image_dialog').show();
        }, {
            destinationType: Camera.DestinationType.DATA_URL,
            encodingType: Camera.EncodingType.JPEG,
            quality: 100,
            sourceType: navigator.camera.PictureSourceType.CAMERA,
            cameraDirection: navigator.camera.Direction.FRONT,
            targetWidth: 384,
            targetHeight: 512,
            correctOrientation: true
        });
    },
    bleInit: function() {
        bluetoothle.hasPermission(function(result) {
            var checkLocation = function() {
                bluetoothle.isLocationEnabled(function(result) {
                    if (result.isLocationEnabled == false) {
                        bluetoothle.requestLocation(function(result) {
                            if (result.requestLocation == false) {
                                ons.notification.alert("Coarse location permission (bluetooth) feature needed to use Cross!");
                                navigator.app.exitApp();
                            }
                        }, function() {
                            ons.notification.alert("Error in requesting coarse location permission (bluetooth) feature");
                            navigator.app.exitApp();
                        });
                    }
                }, function() {
                    ons.notification.alert("Coarse location permission (bluetooth) feature not available on your device!");
                    navigator.app.exitApp();
                });
            }
            if (result.hasPermission == true)
                checkLocation();
            else
                bluetoothle.requestPermission(function(result) {
                    if (result.requestPermission == false) {
                        ons.notification.alert("Must provide coarse location permission (bluetooth) to use Cross!");
                        navigator.app.exitApp();
                    } else {
                        checkLocation();
                    }
                }, function(result) {
                    ons.notification.alert("Error in requesting coarse location permission (bluetooth) permission");
                    navigator.app.exitApp();
                });
        });
        bluetoothle.initialize(
            app.bleScan, {
                "request": true,
                "statusReceiver": true,
                "restoreKey": restore_key,
            });
    },
    bleAdv: function(result) {
        //console.log(JSON.stringify(["adv", result]));
        if ("status" in result)
            switch (result.status) {
                case "enabled":
                case "startAdvertising":
                    bluetoothle.removeAllServices(app.bleAdv, app.bleAdv);
                    break;
                case "allServicesRemoved":
                    bluetoothle.addService(app.bleAdv, app.bleAdv, {
                        service: service_uuid,
                        characteristics: [{
                            uuid: service_characteristic,
                            permissions: { read: true },
                            properties: { read: true }
                        }]
                    });
                    break;
                case "serviceAdded":
                    bluetoothle.startAdvertising(app.bleAdv, app.bleAdv, {
                        "services": [service_uuid],
                        "service": service_uuid,
                        "serviceData": bluetoothle.bytesToEncodedString(bluetoothle.stringToBytes('@' + user.id)),
                        "name": bluetoothle.bytesToEncodedString(bluetoothle.stringToBytes('@' + user.id)),
                        "txPowerLevel": "high",
                        "mode": "lowPower",
                        "timeout": "0",
                        "includeDeviceName": "false"
                    });
                    app.bleScan({ "status": "startScan" });
                    break;
                case "stopAdvertising":
                    bluetoothle.stopAdvertising(app.bleAdv, app.bleAdv);
                    break;
                case "advertisingStopped":
                    app.bleScan({ "status": "startScan" });
                    break;
                case "readRequested":
                    bluetoothle.respond(app.bleAdv, app.bleAdv, {
                        "requestId": result.requestId,
                        "offset": result.offset,
                        "value": bluetoothle.bytesToEncodedString(bluetoothle.stringToBytes(user.id)),
                        "address": result.address
                    });
                    break;
            }
    },
    bleScan: function(result) {
        //console.log(JSON.stringify(["scan", result]));
        if ("status" in result)
            switch (result.status) {
                case "disabled":
                    bluetoothle.enable(app.bleScan, app.bleScan);
                    break;
                case "enabled":
                    bluetoothle.initializePeripheral(app.bleAdv, app.bleAdv, {
                        "request": true,
                        "restoreKey": restore_key,
                    });
                    break;
                case "disabled":
                    break;
                case "scanStopped":
                    app.bleAdv({ "status": "startAdvertising" });
                    break;
                case "startScan":
                    bluetoothle.startScan(app.bleScan, app.bleScan, {
                        "services": [service_uuid],
                        "service": service_uuid,
                        "allowDuplicates": true,
                        "scanMode": bluetoothle.SCAN_MODE_LOW_POWER,
                        "matchMode": bluetoothle.MATCH_MODE_AGGRESSIVE,
                        "matchNum": bluetoothle.MATCH_NUM_ONE_ADVERTISEMENT,
                        "callbackType": bluetoothle.CALLBACK_TYPE_ALL_MATCHES
                    });
                    break;
                case "stopScan":
                    bluetoothle.stopScan(app.bleScan, app.bleScan);
                    break;
                case "scanStarted":
                    break;
                case "scanResult":
                    if (!(result.address in mac)) {
                        mac[result.address] = 1;
                    } else break;
                    var id = null;
                    if (typeof result.advertisement === 'object') { // iOS platform
                        id = result.advertisement.serviceData["2B97"]; // peer is Android
                        if (id == null) // peer is iOS
                            id = result.name;
                        id = bluetoothle.bytesToString(bluetoothle.encodedStringToBytes(id));
                    } else if (typeof result.advertisement === 'string') { // Android platform
                        var isiOS = false;
                        var isIOSbkgd = false;
                        var advPkt = bluetoothle.encodedStringToBytes(result.advertisement);
                        var i = 0,
                            j = 0;
                        for (; i < advPkt.length - 2; i += advPkt[i] + 1) {
                            var nameStr = [],
                                idx = 0;
                            for (j = i + 2; j <= i + advPkt[i]; ++j) {
                                if (advPkt[i + 1] === 9) {
                                    isiOS = true;
                                    nameStr[idx++] = advPkt[j];
                                } else if (advPkt[i + 1] === 22) {
                                    if (idx++ > 1) {
                                        nameStr[idx - 3] = advPkt[j];
                                    }
                                } else if (advPkt[i + 1] === 0xFF) {
                                    if (advPkt[i + 2] === 0x4c) {
                                        if (result.name === null)
                                            break;
                                        nameStr = result.name;
                                        isIOSbkgd = true;
                                    }
                                }
                                if (nameStr !== null)
                                    id = nameStr.concat();
                            }
                        }
                        if (isIOSbkgd)
                            id = bluetoothle.bytesToString(bluetoothle.encodedStringToBytes(id));
                        else {
                            if (id !== null) {
                                id = bluetoothle.bytesToString(id); // peer is Android
                                if (isiOS)
                                    id = bluetoothle.bytesToString(bluetoothle.encodedStringToBytes(id)); // peer is iOS
                            }
                        }
                    }
                    if (id !== null && id[0] == '@') {
                        id = id.substr(1);
                        app.xAddPeer(id);
                    }
                    break;
                case "connect":
                    bluetoothle.connect(app.bleScan, app.bleScan, {
                        "address": result.address,
                        "autoConnect": false
                    });
                    break;
                case "connected":
                    bluetoothle.discover(app.bleScan, app.bleScan, {
                        "address": result.address,
                        "clearCache": false
                    });
                    break;
                case "discovered":
                    bluetoothle.read(app.bleScan, app.bleScan, {
                        "address": result.address,
                        "service": service_uuid,
                        "characteristic": service_characteristic
                    });
                    break;
                case "read":
                    bluetoothle.disconnect(app.bleScan, app.bleScan, { "address": result.address });
                    break;
                case "disconnected":
                    bluetoothle.close(app.bleScan, app.bleScan, { "address": result.address });
                    break;
            };
        if ("error" in result) {
            switch (result.error) {
                case "startScan":
                    bluetoothle.disable(app.bleScan, app.bleScan);
                    break;
                case "connect":
                    bluetoothle.close(app.bleScan, app.bleScan, { "address": result.address });
                    break;
            }
        };
    },
    xUpdatePeers: function() {
        $.ajax({
            type: "POST",
            url: server + "api.php",
            data: "id=" + user.id + "&getstatus=",
            crossDomain: true,
            cache: false,
            beforeSend: function() {
                if (!document.getElementById('message').hasAttribute("swipeable"))
                    document.getElementById('load_modal').show();
            },
            success: function(data) {
                data = JSON.parse(data);
                user.peers = JSON.parse(data.peers);
                user.msgs = JSON.parse(data.msgs);
                for (let id of user.peers) {
                    app.xDisplayPeer(id);
                }
                peers_to_remove = arr_diff(displayed, user.peers);
                for (let id of peers_to_remove) {
                    if (document.getElementById("peer_" + id) !== null)
                        var old_peer = document.getElementById("peer_" + id);
                    old_peer.parentNode.removeChild(old_peer);
                    displayed.splice(displayed.indexOf(id), 1);
                }
                for (let id of user.msgs) {
                    document.getElementById("peer_" + id).style.backgroundColor = "lightblue";
                    document.getElementById("peers_grid").insertBefore(document.getElementById("peer_" + id), document.getElementById("peers_grid").firstChild);
                }
                document.getElementById('load_modal').hide();
            },
            error: function(data) {
                ons.notification.alert('No data connection!');
                document.getElementById('load_modal').hide();
            }
        });
    },
    xAddPeer: function(id) {
        if (id != user.id) {
            $.ajax({
                type: "POST",
                url: server + "api.php",
                data: "fromid=" + user.id + "&toid=" + id + "&mkpeer=",
                crossDomain: true,
                cache: false,
                success: function() {
                    ons.notification.toast({ message: '<div style="text-align:center">CROSSED</div>', timeout: 1000 })
                    app.xUpdatePeers();
                },
                error: function() {
                    setTimeout(function() { app.xAddPeer(id) }, 1000);
                }
            });
        }
    },
    xDisplayPeer: function(id) {
        if (displayed.indexOf(id) == -1)
            displayed.push(id);
        if (document.getElementById("peer_" + id) !== null) {
            var old_peer = document.getElementById("peer_" + id);
            document.getElementById("peers_grid").insertBefore(old_peer, document.getElementById("peers_grid").firstChild);
        } else {
            $.ajax({
                type: "POST",
                url: server + "api.php",
                data: "id=" + id + "&getpeer=",
                crossDomain: true,
                cache: false,
                success: function(data) {
                    peer = JSON.parse(data);
                    var newPeer = document.createElement("ons-card");
                    newPeer.setAttribute("id", "peer_" + id);
                    newPeer.setAttribute("style", "padding:5px; margin:.5%; width:32%; display:inline-block");
                    newPeer.setAttribute("onclick", "app.xChat(" + id + ")");
                    var newPeer_image = document.createElement("img");
                    newPeer_image.setAttribute("id", "peer_" + id + "_image");
                    newPeer_image.setAttribute("src", peer.image);
                    newPeer_image.setAttribute("width", "100%");
                    newPeer_image.setAttribute("style", "vertical-align:middle;");
                    newPeer.appendChild(newPeer_image);
                    if (document.getElementById("peer_" + id) !== null) {
                        var old_peer = document.getElementById("peer_" + id);
                        old_peer.parentNode.removeChild(old_peer);
                    }
                    document.getElementById("peers_grid").insertBefore(newPeer, document.getElementById("peers_grid").firstChild);
                }
            });
        }
    },
    xRemovePeer: function() {
        ons.notification.confirm({ message: 'Do you want to cancel peer connection until next crossing?' })
            .then(function(val) {
                if (val == 1) {
                    clearInterval(chat_interval_id);
                    $.ajax({
                        type: "POST",
                        url: server + "api.php",
                        data: "fromid=" + user.id + "&toid=" + current_toid + "&rmpeer=",
                        crossDomain: true,
                        cache: false,
                        beforeSend: function() {
                            document.getElementById('load_modal').show();
                        },
                        success: function() {
                            document.getElementById('peer_dialog').hide();
                            document.getElementById("message_content").innerHTML = "";
                            app.xUpdatePeers();
                            document.getElementById('message').close();
                            document.getElementById('load_modal').hide();
                        },
                        error: function() {
                            document.getElementById('load_modal').hide();
                        }
                    });
                } else
                    document.getElementById('peer_dialog').hide();
            });
    },
    xRemovePrf: function() {
        ons.notification.confirm({ message: 'Do you want to disappear from Cross?' })
            .then(function(val) {
                if (val == 1) {
                    $.ajax({
                        type: "POST",
                        url: server + "api.php",
                        data: "id=" + user.id + "&rmprf=",
                        crossDomain: true,
                        cache: false,
                        beforeSend: function() {
                            document.getElementById('load_modal').show();
                        },
                        success: function() {
                            document.getElementById('image_dialog').hide();
                            document.getElementById("peers_grid").innerHTML = "";
                            document.getElementById('load_modal').hide();
                            ons.notification.alert('Successfully removed').then(navigator.app.exitApp());
                        },
                        error: function() {
                            document.getElementById('load_modal').hide();
                        }
                    });
                } else
                    document.getElementById('image_dialog').hide();
            });
    },
    xShowChat: function() {
        document.getElementById("message_content").innerHTML = "";
        for (var i in chat_data) {
            var styleStr = "-webkit-user-select: text; user-select: text; display: inline-block;  box-shadow: 1px 1px 1px rgba(10, 72, 90, 0.2); padding: 5px; border-radius: 5px;";
            var msgDiv = document.createElement("div");
            msgDiv.setAttribute("style", "-webkit-user-select: text; user-select: text;");
            var msgSpan = document.createElement("span");
            if (chat_data[i].fromid == user.id)
                msgSpan.setAttribute("style", styleStr + "background-color:lightblue; margin: 0 0 5px 50px; float: right; text-align: right; clear: both;");
            else
                msgSpan.setAttribute("style", styleStr + "background-color:white; light-green; margin: 0 50px 5px 0; float: left; text-align: left; clear: both;");
            msgSpan.innerHTML = chat_data[i].msg;
            msgDiv.appendChild(msgSpan);
            document.getElementById("message_content").appendChild(msgDiv);
        }
        document.getElementById("message_content").scrollTop = document.getElementById("message_content").scrollHeight;
    },
    xChat: function(id) {
        if (current_toid != id)
            document.getElementById("message_content").innerHTML = "";
        current_toid = id;
        document.getElementById('message').open();
        document.getElementById('message').setAttribute("swipeable", "true");
        app.xUpdateChat();
        document.getElementById('peer_' + id).style.backgroundColor = "white";
        chat_interval_id = setInterval(function() {
            $.ajax({
                type: "POST",
                url: server + "api.php",
                data: "id=" + user.id + "&getstatus=",
                crossDomain: true,
                cache: false,
                success: function(data) {
                    data = JSON.parse(data);
                    user.peers = JSON.parse(data.peers);
                    user.msgs = JSON.parse(data.msgs);
                    for (let id of user.msgs) {
                        if (id == current_toid)
                            app.xUpdateChat();
                    }
                }
            });
        }, 1000);
        document.getElementById('message').addEventListener('postclose', function() {
            clearInterval(chat_interval_id);
            document.getElementById('message').removeAttribute('swipeable');
            current_toid = "";
        }, false);
    },
    xUpdateChat() {
        $.ajax({
            type: "POST",
            url: server + "api.php",
            data: "fromid=" + user.id + "&toid=" + current_toid + "&getmsg=",
            crossDomain: true,
            cache: false,
            success: function(data) {
                chat_data = JSON.parse(data);;
                app.xShowChat();
            }
        });
    },
    xSendMsg: function(keyEvent) {
        if (keyEvent.keyCode == 13) {
            var msg = document.getElementById("msg").value;
            if (msg != "") {
                var dataString = "fromid=" + user.id + "&toid=" + current_toid + "&msg=" + msg + "&sendmsg=";
                $.ajax({
                    type: "POST",
                    url: server + "api.php",
                    data: dataString,
                    crossDomain: true,
                    cache: false,
                    success: function(data) {
                        document.getElementById("msg").value = "";
                        chat_data = JSON.parse(data);;
                        app.xShowChat();
                    }
                });
            }
        }
    }
};

app.initialize();