import './sidebar.css'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
function Sidebar() {
  return (
    <div className='sidebar'>
      <h3 className='sidebar-title'>Newsqiq</h3>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/register">Register</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
      </ul>
    </div>)
}

export default Sidebar
