import { BrowserRouter, Route, Switch } from  'react-router-dom'  
import { ApiContextProvider } from './contexts/ApiContexts';

import { AuthContextProvider } from './contexts/AuthContexts';

import { Home } from './pages/Home'
import { Login } from './pages/Login';
import { ChangePassword } from './pages/ChangePassword';

function App() {
  return (
    <BrowserRouter forceRefresh>
        <Switch>
          <AuthContextProvider>
            <Route path="/login" component={Login} />
            <Route path="/forgot-password" component={ChangePassword} />
            <ApiContextProvider>
              <Route path="/home" component={Home} />
            </ApiContextProvider>
          </AuthContextProvider>
        </Switch>
    </BrowserRouter>
  )
}

export default App;
