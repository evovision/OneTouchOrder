/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

//var qrCodeOK = ""; //in production
//var qrCodeOK = "64629003145300"; //in development
//var qrCodeOK = "75432006674104";
var qrCodeOK = "36423009123638";
var lang = {};
var uuid = "123456";
var checkValid = 0;
var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        //document.getElementById('scan').addEventListener('click', this.scan, false);
        document.addEventListener('deviceready', this.onDeviceReady, false);
        //document.getElementById('scan').addEventListener('click', this.scan, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {
        /* var parentElement = document.getElementById(id);
         var listeningElement = parentElement.querySelector('.listening');
         var receivedElement = parentElement.querySelector('.received');
         
         listeningElement.setAttribute('style', 'display:none;');
         receivedElement.setAttribute('style', 'display:block;');*/
        var pwidth = $(window).width()
        var pheight = $(window).height();
        if (pwidth > pheight)
            pheight = pwidth;
        $(".no-header").height(pheight);
        $('div').one('pagehide', function (event, ui) {
            var height = pheight - $(".header-box").height() - 46;
            // $(".ok-content").height(height);
            var node = ".ok-content {height:" + height + "px; margin-top:0px !important;}";
            console.log(node + "+++++++++++++++++++++++++++++");
            var x = document.createElement("STYLE");
            var t = document.createTextNode(node);
            x.appendChild(t);
            document.head.appendChild(x);
        });
        console.log('Received Event: ' + id);
    },
    scan: function () {
        checkLanguage();
        console.log('scanning');
        //var scanner = cordova.require("cordova/plugin/BarcodeScanner");
        console.log('test');
        // scanner.scan( function (result){
        console.log("Scan ok");
        //	qrCode = result.text; 
        //	var qrType = result.format;  //in production
        var qrType = "QR_CODE"; //in development
        //uuid = device.uuid;
        // if(qrCode.indexOf("?qr=") == -1){
        //	alert("Codul nu este valid!");
        //	}else{ 
        //	qrCode = parseInt(qrCode.split("?qr=")[1]);
        //	console.log("split: " + qrCode);

        if (qrType == "QR_CODE") {
            //	qrCodeOK = qrCode;
            //alert("qrCodeOK from scan: " + qrCodeOK);
            if (qrCodeOK) {
                $.ajax({
                    type: 'POST',
                    //url: 'http://creativezone.ro/apk/form/get_app_data.php',
                    url: 'http://82.76.210.88:8000/form/get_app_data.php',
                    timeout: 10000,
                    crossDomain: true,
                    data: {qrcode: qrCodeOK, uuid: uuid},
                    dataType: 'jsonp',
                    //contentType: "application/json",
                    //async: false,
                    success: function (responseData, textStatus, jqXHR) {
                        console.log('POST success');
                        console.log(responseData);
                        if (responseData.state == "invalid") {
                            $.mobile.loading('hide');
                            $(":mobile-pagecontainer").pagecontainer("change", "old/ban.html");
                            setTimeout(function () {
                                navigator.app.exitApp();
                            }, 5000);
                            return;
                        } else {
                            rest = {};
                            rest = responseData;
                            //	console.log(rest);
                            restaurant = rest.rest_name;
                            console.log("restaurant: " + restaurant);
                            //alert("uuid: " + uuid);	
                            addMenu();
                            checkValid = 1;
                            $(":mobile-pagecontainer").pagecontainer("change", "main.html");
                        }
                    },
                    error: function (responseData, textStatus, errorThrown) {
                        console.log('POST failed.');
                        console.log(responseData);
                        //alert("Serverul este ocupat. Te rog sa incerci mai tarziu!");
                        alert("Conexiune la internet inexistenta!");
                        return;
                    }
                });
                //$.mobile.activePage.trigger("refresh");
            } else {
                alert("Codul nu este corect.");
            }
        } else {
            alert("Te rog sa rescanezi.")
        }
        //}

        /* console.log("Scanner result: \n" +
         "text: " + result.text + "\n" +
         "format: " + result.format + "\n" +
         "cancelled: " + result.cancelled + "\n");
         document.getElementById("info").innerHTML = result.text;
         console.log(result); */

        // }, function (error) { 
        //   alert("Te rog sa rescanezi.");	
        // });
    }
}



