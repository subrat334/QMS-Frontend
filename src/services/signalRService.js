// import $ from "jquery";

// let connection = null;
// let hub = null;

// export const startSignalR = () => {
//   return new Promise((resolve, reject) => {
//     try {
//       // Create hub connection
//       connection = $.hubConnection("http://13.202.228.79/backend/signalr");
//       hub = connection.createHubProxy("notificationHub");

//       // Log connection issues
//       connection.error((err) => console.log("SignalR Error:", err));

//       connection.start()
//         .done(() => {
//           console.log("SignalR Connected!");
//           resolve(hub);
//         })
//         .fail((err) => {
//           console.error("Could not connect to SignalR", err);
//           reject(err);
//         });
//     } catch (e) {
//       reject(e);
//     }
//   });
// };

// export const getSignalRHub = () => hub;



import $ from "jquery";

let connection = null;
let hub = null;

let reconnectTimeout = null;

export function startSignalRConnection({ subCategoryId, counterId, onReceiveToken, onReceiveStatus }) {
  console.log("🔌 Starting SignalR connection...");

  if (connection) {
    console.log("⚠️ Connection already exists. Stopping previous connection...");
    connection.stop();
  }

  // --------------------------
  // Create connection with query string
  // --------------------------
  connection = $.hubConnection("http://13.202.228.79/backend/signalr", {
    useDefaultPath: false,
    qs: {
      subCategoryId: subCategoryId || 0,
      counterId: counterId || 0
    }
  });

  console.log("📡 Connecting with QS:", {
    subCategoryId,
    counterId
  });

  // Create hub
  hub = connection.createHubProxy("notificationHub");

  // --------------------------
  // Client event handlers
  // --------------------------

  hub.on("receiveToken", (data) => {
    console.log("🔥 receiveToken (RAW):", data);
    if (onReceiveToken) onReceiveToken(data);
  });

  hub.on("receiveTokenStatus", (data) => {
    console.log("🔄 receiveTokenStatus (RAW):", data);
    if (onReceiveStatus) onReceiveStatus(data);
  });

  // --------------------------
  // Start connection
  // --------------------------
  connection.start()
    .done(() => {
      console.log("✅ SignalR Connected");

      // OPTIONAL manual group joining
      if (subCategoryId) {
        console.log("📌 Invoking JoinSubCategoryGroup:", subCategoryId);
        hub.invoke("JoinSubCategoryGroup", Number(subCategoryId));
      }

      if (counterId) {
        console.log("📌 Invoking JoinCounterGroup:", counterId);
        hub.invoke("JoinCounterGroup", Number(counterId));
      }
    })
    .fail((err) => {
      console.error("❌ SignalR Connection Error:", err);
      scheduleReconnect(subCategoryId, counterId, onReceiveToken, onReceiveStatus);
    });

  // --------------------------
  // Handle disconnects
  // --------------------------
  connection.disconnected(() => {
    console.warn("⚡ SignalR disconnected. Reconnecting in 3 seconds...");
    scheduleReconnect(subCategoryId, counterId, onReceiveToken, onReceiveStatus);
  });

  return hub;
}

function scheduleReconnect(subCategoryId, counterId, onReceiveToken, onReceiveStatus) {
  if (reconnectTimeout) clearTimeout(reconnectTimeout);
  reconnectTimeout = setTimeout(() => {
    startSignalRConnection({ subCategoryId, counterId, onReceiveToken, onReceiveStatus });
  }, 3000);
}
