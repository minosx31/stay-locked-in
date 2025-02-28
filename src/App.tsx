import { Button } from './components/ui/button'
import { NavLink } from 'react-router-dom'

function App() {

  return (
    <>
      <NavLink to='/pomodoro'>
        <Button variant='outline' size='lg'>
          LOCK IN NOW
        </Button>
      </NavLink>
    </>
  )
}

export default App
