import './article.css'
function Article({ title, text, image_link }) {
  return (
    <div className='article'>
      <h2 className='article-title'>{title}</h2>
      <p className='aritcle-text'>{text}</p>
      <img className='article-image' src={image_link} />
    </div>
  )
}
export default Article
