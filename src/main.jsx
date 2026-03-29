import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './ErrorBoundary.jsx'

const root = createRoot(document.getElementById('root'));
root.render(
  <GoogleOAuthProvider clientId="598240123996-ionsntv38ilu49241rjlafesvju2jols.apps.googleusercontent.com">
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </GoogleOAuthProvider>
);
