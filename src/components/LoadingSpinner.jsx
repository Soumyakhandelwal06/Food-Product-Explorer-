export default function LoadingSpinner({ text = 'Loading…' }) {
  return (
    <div className="loading-container" role="status" aria-label={text}>
      <div className="spinner" />
      <p className="loading-text">{text}</p>
    </div>
  )
}
