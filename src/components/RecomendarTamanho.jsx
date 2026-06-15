import { useState } from 'react';

export default function RecomendarTamanho({ tamanhoRecomendado, onClose, onSizeChange }) {
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState(tamanhoRecomendado);
  
  // Mapeamento de tamanhos com informações
  const tamanhos = {
    PP: { label: 'PP', ajuste: 'levemente folgado' },
    P: { label: 'P', ajuste: 'levemente justo' },
    M: { label: 'M', ajuste: 'levemente folgado' },
    G: { label: 'G', ajuste: 'levemente justo' },
    GG: { label: 'GG', ajuste: 'levemente folgado' }
  };

  const tamanhoAtual = tamanhos[tamanhoSelecionado] || tamanhos.P;
  const tamanhosMais = Object.keys(tamanhos).filter(t => t !== tamanhoSelecionado);

  const handleSizeChange = (novo) => {
    setTamanhoSelecionado(novo);
    if (onSizeChange) onSizeChange(novo);
  };

  return (
    <div className="modal-recomendacao-overlay" onClick={onClose}>
      <div className="modal-recomendacao" onClick={(e) => e.stopPropagation()}>
        {/* Botão fechar */}
        <button className="btn-fechar-modal" onClick={onClose}>✕</button>

        {/* Conteúdo principal */}
        <div className="recomendacao-content">
          {/* Coluna esquerda - Medidas */}
          <div className="recomendacao-medidas">
            <h3>Medidas corporais</h3>
            <div className="medidas-info">
              <div className="medida-item">
                <span className="medida-label">Altura</span>
                <span className="medida-valor">170 cm</span>
              </div>
              <div className="medida-item">
                <span className="medida-label">Peso</span>
                <span className="medida-valor">65 kg</span>
              </div>
              <div className="medida-item">
                <span className="medida-label">Busto</span>
                <span className="medida-valor">88 cm</span>
              </div>
              <div className="medida-item">
                <span className="medida-label">Cintura</span>
                <span className="medida-valor">70 cm</span>
              </div>
              <div className="medida-item">
                <span className="medida-label">Quadril</span>
                <span className="medida-valor">98 cm</span>
              </div>
            </div>
          </div>

          {/* Coluna central - Recomendação */}
          <div className="recomendacao-centro">

            {/* Mannequin */}
            <div className="recomendacao-mannequin">
              <div className="mannequin-placeholder">
                <img src="/mannequin_formatos/030303.jpg" alt="Mannequin" />
              </div>
              
              {/* Indicadores de ajuste */}
              <div className="ajuste-indicators">
              </div>
            </div>

            <button className="btn-editar">Editar Medidas</button>
          </div>

          {/* Coluna direita - Outros tamanhos */}
          <div className="recomendacao-tamanhos">
            <p className="tamanhos-titulo">Prove também os tamanhos:</p>
            
            <div className="tamanhos-grid">
              {tamanhosMais.map((tamanho) => (
                <button
                  key={tamanho}
                  className={`btn-tamanho ${tamanho === tamanhoSelecionado ? 'ativo' : ''}`}
                  onClick={() => handleSizeChange(tamanho)}>
                  {tamanho}
                </button>
              ))}
            </div>
            
            <button className="btn-fechar-principal" onClick={onClose}>FECHAR</button>
          </div>
        </div>
      </div>
    </div>
  );
}