import '../Footer.css';

export default function Footer() {

  let ano = new Date().getFullYear();

  return (
    <div className='Footer'>
        <h1>© {ano} Crop • Todos os direitos reservados</h1>
    </div>
  );
}