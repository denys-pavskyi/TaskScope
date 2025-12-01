import { createRoot } from 'react-dom/client'
import './index.css'
import React from 'react'
import { Provider } from 'react-redux'
import { store } from './store/store'
import { App as AntApp } from 'antd'
import { App } from './App'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <AntApp>
        <App />
      </AntApp>
    </Provider>
  </React.StrictMode>
)
