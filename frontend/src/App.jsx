import { useEffect, useState } from 'react'
import './App.css'
import Article from './elements/article.jsx'
import LoadingScreen from "./utils/loadingScreen.jsx"
import ErrorScreen from "./utils/errorScreen.jsx"
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
  if (error) return <ErrorScreen message={"Error happend: {error}"} />;
  return amount.feed_amount
}
function App() {
  const article_count = get_feed_amount();
  const boxes = Array.from({ length: article_count }, (_, i) => i);
  return (
    <div className='feed'>
      {boxes.map(_ => (
        <Article title={"Something"} text={"This is something"} image_link={"https://picsum.photos/400/200"} />
      ))}
    </div>
  )
}

export default App
