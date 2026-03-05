import { AppProviders } from './providers/app-providers'
import { AppRouter } from './routes/AppRouter'

function App() {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  )
}

export default App
