import { useState } from 'react'

export default function CalculoAlturaPeso({ onNext, altura, setAltura, peso, setPeso, idade, setIdade }) {

  return (
    <div className='card card-step'>
      <div className='card-content'>
        <div className='card-copy'>
          <p className='subtitle'>Passo 1</p>
          <h2>Informe suas medidas antropométricas</h2>
          <p className='description'>Preencha altura, peso e idade.</p>

          <div className='form-row'>
            <label htmlFor='altura'>Altura</label>
            <input type='number' id='altura' min='100' max='300' placeholder='cm' value={altura} onChange={(e) => setAltura(Number(e.target.value))} />
          </div>

          <div className='form-row'>
            <label htmlFor='peso'>Peso</label>
            <input type='number' id='peso' min='30' max='200' placeholder='kg' value={peso} onChange={(e) => setPeso(Number(e.target.value))} />
          </div>

          <div className='form-row'>
            <label htmlFor='idade'>Idade</label>
            <input type='number' id='idade' min='0' max='120' placeholder='anos' value={idade} onChange={(e) => setIdade(Number(e.target.value))} />
          </div>
        </div>

        <div className='card-visual'>
          <img src='/produtos/produto1.png' alt='Produto em destaque' />
        </div>
      </div>

      <div className='card-footer'>
        <button className='btn-primary' type='button' onClick={onNext}>Próximo</button>
      </div>
    </div>
  )
}
