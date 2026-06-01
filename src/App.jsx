import DrillPage from './pages/DrillPage.jsx'

export default function App() {
  const root = document.getElementById('root')
  document.documentElement.style.overflow = 'hidden'
  document.body.style.overflow = 'hidden'
  root.style.overflow = 'hidden'
  root.style.height = '100%'

  return <DrillPage />
}
