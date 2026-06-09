import Mannequin from "./mannequin.jsx";

export default function CalculoAlturaPeso() {

    const altura = document.getElementById('altura');
    const peso = document.getElementById('peso');
    const idade = document.getElementById('idade');

    const imageProduto = `/produtos/produto1.png`;

    return (
        <div className='container-calculoAlturaPeso'>
            <img src='/produtos/produto1.png' alt='' />

            <div className='calculoAlturaPeso'>
                <h2>Seja bem vinda ao provador virtual</h2>
                
                <p>Preencha os dados para experimentar este produto</p>
                
                <section>
                    <label htmlFor=''>Altura</label>
                    <input
                        type='number'
                        id='altura'
                        min='100'
                        max='300'
                    />
                </section>

                <section>
                    <label htmlFor=''>Peso</label>
                    <input
                        type='number'
                        id='peso'
                        min='30'
                        max='200'
                    />
                </section>

                <section>
                    <label htmlFor=''>Idade</label>
                    <input
                        type='number'
                        id='idade'
                        min='0'
                        max='120'
                    />
                </section>

                <div className="div-btn-proximo">
                    <button className="btn-proximo" onClick={<Mannequin/>}>Próximo</button>
                </div>
            </div>
        </div>
    )
}