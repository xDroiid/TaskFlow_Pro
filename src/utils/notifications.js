export const requestNotificationPermission = async () => {
  if (!("Notification" in window)) {
    console.warn("This browser does not support desktop notification");
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  return false;
};

export const scheduleNotification = (task) => {
  if (!task.reminderTime || Notification.permission !== "granted") return;

  const reminderDate = new Date(task.reminderTime);
  const now = new Date();
  const delay = reminderDate.getTime() - now.getTime();

  if (delay <= 0) return;

  // Store timeout ID if needed to cancel
  return setTimeout(() => {
    new Notification("TaskFlow Reminder", {
      body: `It's time for: ${task.title}`,
      icon: "/favicon.ico", // Or a custom Sparkles icon
      tag: task._id
    });
  }, delay);
};

export const sendImmediateNotification = (title, body) => {
  if (Notification.permission === "granted") {
    new Notification(title, { body, icon: "/favicon.ico" });
  }
};
