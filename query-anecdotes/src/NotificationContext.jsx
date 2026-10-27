import { createContext, useContext, useState } from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState("");

  const notify = (message) => {
    setNotification(message);

    setTimeout(() => {
      setNotification("");
    }, 5000);
  };

  return (
    <NotificationContext.Provider value={{ notification, notify }}>
      {children}
    </NotificationContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useNotify = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error("useNotify must be used inside NotificationProvider");
  }

  return context;
};
