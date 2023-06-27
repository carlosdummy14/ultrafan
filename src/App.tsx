import { Route } from "wouter"
import Home from "./pages/Home"
import { Suspense, lazy } from "react"

const NewLeague = lazy(() => import("./pages/NewLeague"))

function App() {
  return (
    <Suspense>
      <Route path="/">
        <Home />
      </Route>
      <Route path="/newleague">
        <NewLeague />
      </Route>
    </Suspense>
  )
}

export default App
