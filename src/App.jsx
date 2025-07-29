import './App.css'
import SpiralGalaxy from './components/SpiralGalaxy'
import StarField from './components/StarField'
import content from './content'
import { useEffect, useState } from 'react'

function App() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? scrollTop / docHeight : 0
      setScrollProgress(Math.min(Math.max(progress, 0), 1)) // Clamp 0..1
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Background visual layers */}
      <StarField />
      <SpiralGalaxy angle={0} tilt={Math.PI / 12} scrollProgress={scrollProgress} />

      {/* Page content */}
      <main className="content">
        {Object.entries(content).map(([sectionId, section]) => (
          <section key={sectionId} id={sectionId} style={{ minHeight: '100vh' }}>
            <div className="section-content">
              <h2 className="section-title">{section.title}</h2>
              <p className="section-description">{section.description}</p>
            </div>
          </section>
        ))}
      </main>

      {/* Optional: force scrollable height for testing */}
      <div style={{ height: '100vh' }} />
    </>
  )
}

export default App
