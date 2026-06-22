import { useState } from 'react';
import guiaMedidas from '../../public/_comoMedirCrop2.jpg';
export default function MedidasCliente({ onNext, busto, setBusto, cintura, setCintura, quadril, setQuadril }) {

    const [checked, setChecked] = useState(false);
    
    return (
        <div className='card card-step'>
            <div className='card-content'>
                <div className='card-copy'>
                    <p className='subtitle'>Passo 2</p>
                    <h2>Conte-nos suas medidas</h2>
                    <p className='description'>Preencha Busto, cintura e quadril para gerar o mannequin correto.</p>

                    <div className="form-row-medidas">
                        <input id="isMedidas" type="checkbox" onChange={(e) => setChecked(e.target.checked)} />
                        <label htmlFor="isMedidas">Não sei minhas medidas</label>
                    </div>

                    <div className='form-row' style={{display: checked ? "none" : "block"}} >
                        <label htmlFor='busto'>Busto</label>
                        <input type='number' id='busto' min='25' max='120' placeholder='cm' value={busto} onChange={(e) => setBusto(Number(e.target.value))} />
                    </div>

                    <div className='form-row' style={{display: checked ? "none" : "block"}}>
                        <label htmlFor='cintura'>Cintura</label>
                        <input type='number' id='cintura' min='30' max='120' placeholder='cm' value={cintura} onChange={(e) => setCintura(Number(e.target.value))} />
                    </div>

                    <div className='form-row' style={{display: checked ? "none" : "block"}}>
                        <label htmlFor='quadril'>Quadril</label>
                        <input type='number' id='quadril' min='0' max='120' placeholder='cm' value={quadril} onChange={(e) => setQuadril(Number(e.target.value))} />
                    </div>
                </div>

                <div className='card-visual'>
                    <img src={guiaMedidas} alt='' />
                </div>
            </div>
            
            <div className='card-footer'>
                <button className='btn-primary' type='button' onClick={onNext}>Próximo</button>
            </div>
        </div>
    )
}