import { AppProviders } from './providers/AppProviders'
import { ThemeProvider } from './providers/ThemeProvider'
import { AppRouter } from './routes/AppRouter'

function App() {
  return (
    <ThemeProvider>
      <AppProviders>
        <AppRouter />
      </AppProviders>
    </ThemeProvider>
  )
}

export default App
