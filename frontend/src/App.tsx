import { AuthProvaider } from "./contexts/AuthContext"

import RouteApp from './routes'

function App() {

  return (
    <AuthProvaider>
      <div>
        <RouteApp />
      </div>
    </AuthProvaider>


  )
}

export default App
