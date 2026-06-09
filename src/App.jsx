import './App.css'
import Mannequin from './components/Mannequin.jsx'

export default function App() {

  function calcularIMC() {
    let altura = document.getElementById('alturavalor').value;
    let peso = document.getElementById('pesovalor').value;

    let imc = peso / (altura * altura);
    let imcFormatado = imc.toFixed(2);

    let resultado = document.getElementById('resultado');

    resultado.innerText = `Seu IMC é: ${imcFormatado}`;
  }

  return (
    
    <div className='container'>
      <div className='boneco'>
        <Mannequin />
      </div>
    </div>
  )
}