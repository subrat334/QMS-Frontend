/*!
 * ASP.NET SignalR JavaScript Library 2.4.3
 * http://signalr.net/
 *
 * Copyright (c) .NET Foundation. All rights reserved.
 * Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
 *
 */

(function ($, window, undefined) {
    /// <param name="$" type="jQuery" />
    "use strict";

    if (typeof ($.signalR) !== "function") {
        throw new Error("SignalR: SignalR is not loaded. Please ensure jquery.signalR-x.js is referenced before ~/signalr/js.");
    }

    var signalR = $.signalR;

    function makeProxyCallback(hub, callback) {
        return function () {
            // Call the client hub method
            callback.apply(hub, $.makeArray(arguments));
        };
    }

    function registerHubProxies(instance, shouldSubscribe) {
        var key, hub, memberKey, memberValue, subscriptionMethod;

        for (key in instance) {
            if (instance.hasOwnProperty(key)) {
                hub = instance[key];

                if (!(hub.hubName)) {
                    // Not a client hub
                    continue;
                }

                if (shouldSubscribe) {
                    // We want to subscribe to the hub events
                    subscriptionMethod = hub.on;
                } else {
                    // We want to unsubscribe from the hub events
                    subscriptionMethod = hub.off;
                }

                // Loop through all members on the hub and find client hub functions to subscribe/unsubscribe
                for (memberKey in hub.client) {
                    if (hub.client.hasOwnProperty(memberKey)) {
                        memberValue = hub.client[memberKey];

                        if (!$.isFunction(memberValue)) {
                            // Not a client hub function
                            continue;
                        }

                        // Use the actual user-provided callback as the "identity" value for the registration.
                        subscriptionMethod.call(hub, memberKey, makeProxyCallback(hub, memberValue), memberValue);
                    }
                }
            }
        }
    }

    $.hubConnection.prototype.createHubProxies = function () {
        var proxies = {};
        this.starting(function () {
            // Register the hub proxies as subscribed
            // (instance, shouldSubscribe)
            registerHubProxies(proxies, true);

            this._registerSubscribedHubs();
        }).disconnected(function () {
            // Unsubscribe all hub proxies when we "disconnect".  This is to ensure that we do not re-add functional call backs.
            // (instance, shouldSubscribe)
            registerHubProxies(proxies, false);
        });

        proxies['notificationHub'] = this.createHubProxy('notificationHub'); 
        proxies['notificationHub'].client = { };
        proxies['notificationHub'].server = {
            broadcastCall: function (data) {
                return proxies['notificationHub'].invoke.apply(proxies['notificationHub'], $.merge(["BroadcastCall"], $.makeArray(arguments)));
             },

            broadcastToken: function (data) {
                return proxies['notificationHub'].invoke.apply(proxies['notificationHub'], $.merge(["BroadcastToken"], $.makeArray(arguments)));
             }
        };

        return proxies;
    };

    signalR.hub = $.hubConnection("/backend/signalr", { useDefaultPath: false });
    $.extend(signalR, signalR.hub.createHubProxies());

}(window.jQuery, window));