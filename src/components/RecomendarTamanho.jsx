import { useEffect, useMemo, useState } from 'react';

const CAMPOS_MEDIDAS = [
  { key: 'busto', label: 'Busto', posicao: 'busto' },
  { key: 'cintura', label: 'Cintura', posicao: 'cintura' },
  { key: 'quadril', label: 'Quadril', posicao: 'quadril' }
];

function medidaNumero(valor) {
  const numero = Number(valor);
  return Number.isFinite(numero) ? numero : null;
}

function normalizarTamanho(tamanho) {
  const medidas = tamanho.measurements ?? tamanho.medidas ?? {};

  return {
    label: tamanho.label ?? tamanho.size ?? tamanho.tamanho ?? '',
    busto: medidaNumero(tamanho.busto ?? medidas.busto ?? medidas.bust),
    cintura: medidaNumero(tamanho.cintura ?? medidas.cintura ?? medidas.waist),
    quadril: medidaNumero(tamanho.quadril ?? medidas.quadril ?? medidas.hips)
  };
}

function classificarAjuste(medidaCliente, medidaRoupa) {
  if (medidaCliente == null || medidaRoupa == null) return 'indefinido';

  const folga = medidaRoupa - medidaCliente;

  if (folga < -2) return 'apertado';
  if (folga > 5) return 'folgado';
  return 'perfeito';
}

function textoAjuste(status) {
  if (status === 'apertado') return 'Apertada';
  if (status === 'folgado') return 'Folgado';
  if (status === 'perfeito') return 'Perfeito';
  return 'Sem medida';
}

function pontuarTamanho(tamanho, medidasCliente) {
  return CAMPOS_MEDIDAS.reduce((score, campo) => {
    const medidaCliente = medidasCliente[campo.key];
    const medidaRoupa = tamanho[campo.key];

    if (medidaCliente == null || medidaRoupa == null) return score + 100;

    const folga = medidaRoupa - medidaCliente;
    const alvoConforto = 2;
    const penalidadeApertado = folga < -2 ? Math.abs(folga) * 12 : 0;
    const penalidadeFolgado = folga > 5 ? (folga - 5) * 4 : 0;

    return score + Math.abs(folga - alvoConforto) + penalidadeApertado + penalidadeFolgado;
  }, 0);
}

export default function RecomendarTamanho({
  tamanhoRecomendado,
  onClose,
  onSizeChange,
  altura,
  peso,
  busto,
  setBusto,
  cintura,
  setCintura,
  quadril,
  setQuadril,
  formatoCorpo,
  roupaSelecionada
}) {
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState(tamanhoRecomendado);
  const [editandoMedidas, setEditandoMedidas] = useState(false);
  const [medidasEditadas, setMedidasEditadas] = useState({
    busto: busto ?? '',
    cintura: cintura ?? '',
    quadril: quadril ?? ''
  });

  const mannequinSrc = `/mannequin_formatos/${formatoCorpo || '030303'}.jpg`;
  const medidasCliente = useMemo(() => ({
    busto: medidaNumero(busto),
    cintura: medidaNumero(cintura),
    quadril: medidaNumero(quadril)
  }), [busto, cintura, quadril]);

  const tamanhosRoupa = useMemo(() => {
    const tamanhos = roupaSelecionada?.tamanhos ?? roupaSelecionada?.sizes ?? [];
    return tamanhos.map(normalizarTamanho).filter((tamanho) => tamanho.label);
  }, [roupaSelecionada]);

  const tamanhoIdeal = useMemo(() => {
    if (tamanhosRoupa.length === 0) return null;

    return tamanhosRoupa.reduce((melhor, tamanho) => (
      pontuarTamanho(tamanho, medidasCliente) < pontuarTamanho(melhor, medidasCliente) ? tamanho : melhor
    ), tamanhosRoupa[0]);
  }, [tamanhosRoupa, medidasCliente]);

  useEffect(() => {
    if (!tamanhoIdeal?.label) return;

    setTamanhoSelecionado(tamanhoIdeal.label);
    if (onSizeChange) onSizeChange(tamanhoIdeal.label);
  }, [tamanhoIdeal?.label, onSizeChange]);

  const tamanhoAtual = tamanhosRoupa.find((tamanho) => tamanho.label === tamanhoSelecionado) ?? tamanhoIdeal;
  const tamanhosMais = tamanhosRoupa.filter((tamanho) => tamanho.label !== tamanhoSelecionado);
  const ajustes = CAMPOS_MEDIDAS.map((campo) => ({
    ...campo,
    status: classificarAjuste(medidasCliente[campo.key], tamanhoAtual?.[campo.key])
  }));

  const handleSizeChange = (novo) => {
    setTamanhoSelecionado(novo);
    if (onSizeChange) onSizeChange(novo);
  };

  const abrirEdicaoMedidas = () => {
    setMedidasEditadas({
      busto: busto ?? '',
      cintura: cintura ?? '',
      quadril: quadril ?? ''
    });
    setEditandoMedidas(true);
  };

  const handleMedidaChange = (campo, valor) => {
    setMedidasEditadas((medidasAtuais) => ({
      ...medidasAtuais,
      [campo]: valor
    }));
  };

  const salvarMedidas = () => {
    if (setBusto) setBusto(medidasEditadas.busto === '' ? '' : Number(medidasEditadas.busto));
    if (setCintura) setCintura(medidasEditadas.cintura === '' ? '' : Number(medidasEditadas.cintura));
    if (setQuadril) setQuadril(medidasEditadas.quadril === '' ? '' : Number(medidasEditadas.quadril));
    setEditandoMedidas(false);
  };

  return (
    <div className="modal-recomendacao-overlay" onClick={onClose}>
      <div className="modal-recomendacao" onClick={(e) => e.stopPropagation()}>
        <button className="btn-fechar-modal" onClick={onClose}>x</button>

        {editandoMedidas ? (
          <div className="editar-medidas-content">
            <h3>Editar medidas</h3>

            <div className="editar-medidas-form">
              <label htmlFor="editar-busto">Busto</label>
              <div className="editar-medida-input">
                <input id="editar-busto" type="number" min="0" value={medidasEditadas.busto} onChange={(e) => handleMedidaChange('busto', e.target.value)} />
                <span>cm</span>
              </div>

              <label htmlFor="editar-cintura">Cintura</label>
              <div className="editar-medida-input">
                <input id="editar-cintura" type="number" min="0" value={medidasEditadas.cintura} onChange={(e) => handleMedidaChange('cintura', e.target.value)} />
                <span>cm</span>
              </div>

              <label htmlFor="editar-quadril">Quadril</label>
              <div className="editar-medida-input">
                <input id="editar-quadril" type="number" min="0" value={medidasEditadas.quadril} onChange={(e) => handleMedidaChange('quadril', e.target.value)} />
                <span>cm</span>
              </div>
            </div>

            <div className="editar-medidas-actions">
              <button className="btn-editar" type="button" onClick={() => setEditandoMedidas(false)}>Cancelar</button>
              <button className="btn-salvar-medidas" type="button" onClick={salvarMedidas}>Salvar</button>
            </div>
          </div>
        ) : (
          <div className="recomendacao-content">
            <div className="recomendacao-medidas">
              <h3>Medidas corporais</h3>
              <div className="medidas-info">
                <div className="medida-item">
                  <span className="medida-label">Altura</span>
                  <span className="medida-valor">{altura} cm</span>
                </div>
                <div className="medida-item">
                  <span className="medida-label">Peso</span>
                  <span className="medida-valor">{peso} kg</span>
                </div>
                <div className="medida-item">
                  <span className="medida-label">Busto</span>
                  <span className="medida-valor">{busto} cm</span>
                </div>
                <div className="medida-item">
                  <span className="medida-label">Cintura</span>
                  <span className="medida-valor">{cintura} cm</span>
                </div>
                <div className="medida-item">
                  <span className="medida-label">Quadril</span>
                  <span className="medida-valor">{quadril} cm</span>
                </div>
                  <button className="btn-editar" onClick={abrirEdicaoMedidas} type="button">Editar medidas</button>
              </div>
            </div>

            <div className="recomendacao-centro">
              <div className="recomendacao-mannequin">
                <div className="mannequin-placeholder">
                  <img src={mannequinSrc} alt={`Mannequin ${formatoCorpo || '030303'}`} />
                  {ajustes.map((ajuste) => (
                    <span key={ajuste.key} className={`faixa-ajuste faixa-${ajuste.posicao} ${ajuste.status}`}>
                      {ajuste.label}
                    </span>
                  ))}
                </div>

                <div className="ajuste-indicators">
                  {ajustes.map((ajuste) => (
                    <div key={ajuste.key} className={`ajuste-item ${ajuste.status}`}>
                      <span className="ajuste-dot"></span>
                      <span>{ajuste.label}: {textoAjuste(ajuste.status)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="recomendacao-tamanhos">
              <p className="tamanhos-titulo">Prove tambem os tamanhos:</p>

              <div className="tamanhos-grid">
                {tamanhosMais.map((tamanho) => (
                  <button
                    key={tamanho.label}
                    className={`btn-tamanho ${tamanho.label === tamanhoSelecionado ? 'ativo' : ''}`}
                    onClick={() => handleSizeChange(tamanho.label)}
                  >
                    {tamanho.label}
                  </button>
                ))}
                <div className="container-modal-recomedadacao-tamanho">
                  <h3>{tamanhoSelecionado === tamanhoIdeal?.label ? 'Tamanho recomendado:' : 'Tamanho selecionado:'}</h3>

                  <div className="modal-recomendacao-tamanho2">
                    <div className="modal-recomendacao-tamanho">
                      <h1>{tamanhoSelecionado}</h1>
                    </div>
                  </div>

                  {tamanhoSelecionado !== tamanhoIdeal?.label && (
                    <p className="tamanho-ideal-info">Ideal: {tamanhoIdeal?.label}</p>
                  )}
                </div>
              </div>

              <button className="btn-fechar-principal" onClick={onClose}>FECHAR</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
