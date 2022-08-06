import { BrowserRouter, Route, Switch } from  'react-router-dom'  

import { AuthContextProvider } from './contexts/AuthContexts';

import { Home } from './pages/Home'
import { Login } from './pages/Login';

function App() {
  return (
    <BrowserRouter forceRefresh>
      <AuthContextProvider>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/home" component={Home} />
        </Switch>
      </AuthContextProvider>
    </BrowserRouter>
  )
}

export default App;
