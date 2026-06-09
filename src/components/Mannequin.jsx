
import { useState } from 'react';

const imageMap = import.meta.glob('../assets/mannequin_formatos/*.jpg', { eager: true, as: 'url' });
const imagesByName = Object.fromEntries(
  Object.entries(imageMap).map(([path, url]) => [path.split('/').pop(), url])
);

export default function Mannequin() {
  const [busto, setBusto] = useState(3);
  const [cintura, setCintura] = useState(3);
  const [quadril, setQuadril] = useState(3);

  const formato = [busto, cintura, quadril]
    .map((value) => value.toString().padStart(2, '0'))
    .join('');
  const imageSrc = imagesByName[`${formato}.jpg`] ?? '';

  return (
    <div className='boneco'>
      <img src={imageSrc} alt={`Mannequin ${formato}`} />

      <div className='formMedidas'>
        <h2>Ajuste o formato do corpo</h2>

        <h3>Este é o formato aproximado do corpo que geramos com suas medidas. Ajuste somente se for necessário.</h3>

        <label htmlFor='busto'>Busto: {busto}</label>
        <input
          type='range'
          id='busto'
          min='1'
          max='5'
          value={busto}
          onChange={(event) => setBusto(event.target.value)}
        />

        <label htmlFor='cintura'>Cintura: {cintura}</label>
        <input
          type='range'
          id='cintura'
          min='1'
          max='5'
          value={cintura}
          onChange={(event) => setCintura(event.target.value)}
        />

        <label htmlFor='quadril'>Quadril: {quadril}</label>
        <input
          type='range'
          id='quadril'
          min='1'
          max='5'
          value={quadril}
          onChange={(event) => setQuadril(event.target.value)}
        />
      </div>
    </div>
  );
}
