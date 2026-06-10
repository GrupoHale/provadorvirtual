import { useState } from 'react'
import './App.css'
import Mannequin from './components/Mannequin.jsx'
import CalculoAlturaPeso from './components/CalculoAlturaPeso.jsx'

export default function App() {
  const [step, setStep] = useState(1)

  return (
    <main className='app'>
      <header className='app-header'>
        <div>
          <p className='eyebrow'>Provador Virtual</p>
          <h1>Experimente roupas com suas medidas</h1>
        </div>
        <div className='step-indicator'>Etapa {step} de 2</div>
      </header>

      <section className='page-content'>
        {step === 1 && <CalculoAlturaPeso onNext={() => setStep(2)} />}
        {step === 2 && <Mannequin onBack={() => setStep(1)} />}
      </section>
    </main>
  )
}