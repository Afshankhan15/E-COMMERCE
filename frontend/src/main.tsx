// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.tsx'

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )
import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
import './styles/stylesheet.css' // import scss file in main
import App from './App.tsx'
import {Provider} from 'react-redux'
import {store} from './redux/reducer/store.ts'

import ReactModal from 'react-modal'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
    <App />
    </Provider>
  </StrictMode>,
)


useEffect(() => {
  ReactModal.setAppElement("#root") // This line ensures accessibility for modals
}, [])