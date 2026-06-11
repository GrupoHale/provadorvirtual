import { useEffect, useState } from 'react'
import './App.css'
import Mannequin from './components/Mannequin.jsx'
import CalculoAlturaPeso from './components/CalculoAlturaPeso.jsx'
import RecomendarTamanho from './components/RecomendarTamanho.jsx'
import AdminPage from './pages/Admin.jsx'

export default function App() {
  const [step, setStep] = useState(1)
  const [mostrarRecomendacao, setMostrarRecomendacao] = useState(false)
  const [tamanhoRecomendado, setTamanhoRecomendado] = useState('P')
  const [route, setRoute] = useState(location.hash || '')

  useEffect(() => {
    function onHash() {
      setRoute(location.hash || '')
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const handleShowRecommendation = () => {
    setMostrarRecomendacao(true)
  }

  const handleCloseRecommendation = () => {
    setMostrarRecomendacao(false)
  }
  
  return (
    <main className='app'>
      <header className='app-header'>
        <div>
          <p className='eyebrow'>Provador Virtual</p>
          <h1>Experimente as roupas com suas medidas</h1>
        </div>
        <div className='step-indicator'>Etapa {step} de 2</div>
      </header>

      <section className='page-content'>
        {route === '#/admin' ? (
          <AdminPage />
        ) : (
          <>
            {step === 1 && <CalculoAlturaPeso onNext={() => setStep(2)} />}
            {step === 2 && <Mannequin onBack={() => setStep(1)} onShowRecommendation={handleShowRecommendation} />}
          </>
        )}
      </section>

      {mostrarRecomendacao && (
        <RecomendarTamanho 
          tamanhoRecomendado={tamanhoRecomendado}
          onClose={handleCloseRecommendation}
          onSizeChange={setTamanhoRecomendado}
        />
      )}
    </main>
  )
}