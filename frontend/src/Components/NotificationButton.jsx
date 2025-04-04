import React from "react";

const notifyUser = () => {
  if (Notification.permission !== "granted") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        new Notification("🎉 Wassup Vincent!", {
          body: "Here's your lit daily message. Get back to hustlin' 💻💰",
        });
      }
    });
  } else {
    new Notification("🔥 You're crushing it!", {
      body: "Time to level up, my king 👑",
    });
  }
};

const NotificationButton = () => {
  return (
    <div>
      <button onClick={notifyUser} className="bg-white flex m-auto mb-5 rounded-2xl p-3">
        Click me for Good Vibes ✨
      </button>
    </div>
  );
};

export default NotificationButton;
