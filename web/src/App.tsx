import { BrowserRouter, Route, Switch } from  'react-router-dom'  
import { ApiContextProvider } from './contexts/ApiContexts';

import { AuthContextProvider } from './contexts/AuthContexts';

import { Home } from './pages/Home'
import { Login } from './pages/Login';

function App() {
  return (
    <BrowserRouter forceRefresh>
      <AuthContextProvider>
        <ApiContextProvider>
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/home" component={Home} />
          </Switch>
        </ApiContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  )
}

export default App;
