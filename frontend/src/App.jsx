import { useEffect, useState } from 'react'
import './App.css'
import Register from './routes/register.jsx'
import Login from './routes/login.jsx'
import Article from './elements/article.jsx'
import Sidebar from './elements/sidebar.jsx'
import LoadingScreen from "./utils/loadingScreen.jsx"
import ErrorScreen from "./utils/errorScreen.jsx"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function get_feed_amount() {
  const [amount, setAmount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch("http://localhost:42069/api/fetch_feed_amount")
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok")
        }
        return response.json()
      })
      .then(data => {
        setAmount(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) return <LoadingScreen message={"Content loading"} />;
  if (error) return <ErrorScreen message={`Error happened: ${error}`} />;

  return amount.feed_amount - amount.feed_amount % 3 // God forbid my for my sins
}

function App() {
  const article_count = get_feed_amount();
  const boxes = Array.from({ length: article_count }, (_, i) => i);

  return (
    <Router>
      <div className='screen'>
        <Sidebar />
      </div>
      <Routes>
        <Route
          path="/"
          element={
            <div className='all'>
              <div className='feed'>
                {boxes.map((_, i) => (
                  <Article
                    key={i}
                    title={"Something"}
                    text={"This is something"}
                    image_link={"https://picsum.photos/400/200"}
                  />
                ))}
              </div>
              <div className='register-screen'>
                {/* maybe empty or something else */}
              </div>
            </div>
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router >
  )
}

export default App
