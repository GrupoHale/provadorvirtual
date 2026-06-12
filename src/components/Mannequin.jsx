import { useState } from 'react';

export default function Mannequin({ onBack, onShowRecommendation }) {
  const [busto, setBusto] = useState(3);
  const [cintura, setCintura] = useState(3);
  const [quadril, setQuadril] = useState(3);

  // Gera formato tipo: 030303
  const formato = [busto, cintura, quadril]
    .map((value) => Number(value).toString().padStart(2, '0'))
    .join('');

  // Caminho direto (NUNCA quebra no build)
  const imageSrc = `/mannequin_formatos/${formato}.jpg`;
  
  return (
    <div className='boneco'>
      <img
        src={imageSrc}
        alt={`Mannequin ${formato}`}
        onError={(e) => {
          console.error('Imagem não encontrada:', imageSrc);
          e.target.style.display = 'none';
        }}
      />
      
      <div className='formMedidas'>
        <h2>Ajuste o formato do corpo</h2>

        <h3>
          Este é o formato aproximado do corpo que geramos com suas medidas.
          Ajuste somente se for necessário.
        </h3>

        <label htmlFor='busto'>Busto</label>
        <input
          type='range'
          id='busto'
          min='1'
          max='5'
          value={busto}
          onChange={(e) => setBusto(Number(e.target.value))}
        />

        <label htmlFor='cintura'>Cintura</label>
        <input
          type='range'
          id='cintura'
          min='1'
          max='5'
          value={cintura}
          onChange={(e) => setCintura(Number(e.target.value))}
        />

        <label htmlFor='quadril'>Quadril</label>
        <input
          type='range'
          id='quadril'
          min='1'
          max='5'
          value={quadril}
          onChange={(e) => setQuadril(Number(e.target.value))}
        />

        <div className='card-footer-mannequin'>
          <button className='btn-voltar' type='button' onClick={onBack}>Voltar</button>
          <button className='btn-proximo' type='button' onClick={() => onShowRecommendation && onShowRecommendation()}>Recomendação</button>
        </div>
      </div> 
    </div>
  );
}