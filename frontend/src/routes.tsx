import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './pages/login/login';
import Register from './pages/register/register'

function RouteApp() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' Component={Login}/>
                <Route path='/register' Component={Register}/>
              
            </Routes>

        </BrowserRouter>
    )
}
export default RouteApp;