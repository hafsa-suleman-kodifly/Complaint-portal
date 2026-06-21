import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { notification, App as AntApp } from "antd"
import StatusChangeCard from "./StatusChangeCard.jsx"

// Provides a global "pushStatusNotification" used by the dashboard + realtime
// layer to surface animated popups and keep a running feed.
const NotificationFeedContext = createContext({ feed: [], unread: 0, markRead: () => {} })

export const useNotificationFeed = () => useContext(NotificationFeedContext)

export default function NotificationProvider({ children }) {
  const { notification: notifyApi } = AntApp.useApp()
  const [api, contextHolder] = notification.useNotification({
    stack: { threshold: 3 },
    duration: 0, // require explicit OK/close, per spec
  })
  const [feed, setFeed] = useState([])
  const [unread, setUnread] = useState(0)

  const push = useCallback(
    (event) => {
      const key = `${event.reference_number}-${Date.now()}`
      const entry = { ...event, key, time: new Date().toISOString() }
      setFeed((prev) => [entry, ...prev].slice(0, 30))
      setUnread((u) => u + 1)

      api.open({
        key,
        placement: "topRight",
        closeIcon: true,
        message: null,
        description: (
          <StatusChangeCard event={event} onOk={() => api.destroy(key)} />
        ),
        style: {
          width: 380,
          borderRadius: 16,
          padding: 0,
          overflow: "hidden",
          boxShadow: "0 12px 40px rgba(15, 39, 77, 0.18)",
        },
        className: "cr-status-notification",
      })
    },
    [api],
  )

  const markRead = useCallback(() => setUnread(0), [])

  // Expose globally so non-React modules (realtime sim) can also trigger.
  useEffect(() => {
    window.__pushStatusNotification = push
    return () => {
      delete window.__pushStatusNotification
    }
  }, [push])

  void notifyApi

  return (
    <NotificationFeedContext.Provider value={{ feed, unread, markRead, push }}>
      {contextHolder}
      {children}
    </NotificationFeedContext.Provider>
  )
}
