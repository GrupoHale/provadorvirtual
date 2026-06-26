function normalizarProduto(produto, index) {
  return {
    id: produto.id ?? `admin-${index}`,
    nome: produto.nome ?? produto.name ?? 'Peca sem nome',
    imagem: produto.imagem ?? produto.image ?? '',
    descricao: produto.descricao ?? produto.description ?? '',
    tamanhos: produto.tamanhos ?? produto.sizes ?? []
  }
}

function carregarRoupas() {
  try {
    const raw = localStorage.getItem('pieces')
    const roupasAdmin = raw ? JSON.parse(raw) : []

    if (Array.isArray(roupasAdmin) && roupasAdmin.length > 0) {
      return roupasAdmin.map(normalizarProduto)
    }
  } catch {
    // Sem roupas quando o armazenamento local nao puder ser lido.
  }

  return []
}

export default function SelecionarRoupa({ roupaSelecionada, setRoupaSelecionada, onNext }) {
  const roupas = carregarRoupas()
  const roupaAtual = roupaSelecionada ?? roupas[0]

  function selecionarRoupa(roupa) {
    setRoupaSelecionada(roupa)
  }

  function avancar() {
    const roupaParaProvar = roupaSelecionada ?? roupas[0]

    setRoupaSelecionada(roupaParaProvar)
    onNext(roupaParaProvar)
  }

  return (
    <div className='card card-step'>
      <div className='card-copy selecionar-roupa-header'>
        <p className='subtitle'>Passo 1</p>
        <h2>Escolha a roupa que deseja provar</h2>
      </div>

      {roupas.length === 0 ? (
        <div className='empty-state'>
          <h3>Nenhuma peça cadastrada</h3>
        </div>
      ) : (
        <div className='roupas-grid'>
          {roupas.map((roupa) => {
            const selecionada = roupaAtual?.id === roupa.id

            return (
              <button
                key={roupa.id}
                type='button'
                className={`roupa-card ${selecionada ? 'selecionada' : ''}`}
                onClick={() => selecionarRoupa(roupa)}
                aria-pressed={selecionada}
              >
                <span className='roupa-image-wrap'>
                  {roupa.imagem ? (
                    <img src={roupa.imagem} alt={roupa.nome} />
                  ) : (
                    <span className='roupa-image-placeholder'>Sem imagem</span>
                  )}
                </span>

                <span className='roupa-info'>
                  <strong>{roupa.nome}</strong>
                  {roupa.descricao && <span>{roupa.descricao}</span>}
                </span>
              </button>
            )
          })}
        </div>
      )}

      <div className='card-footer'>
        <button className='btn-primary' type='button' onClick={avancar} disabled={roupas.length === 0}>
          Proximo
        </button>
      </div>
    </div>
  )
}
