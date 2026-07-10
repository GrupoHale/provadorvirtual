import { useEffect, useState } from 'react'
import '../App.css'

const CATEGORIAS = [
  { id: 1, nome: "blusa", medidas: ["busto", "cintura", "quadril"] },
  { id: 2, nome: "camisa", medidas: ["busto", "cintura", "quadril"] },
  { id: 3, nome: "calça", medidas: ["cintura", "quadril", "comprimento"] },
  { id: 4, nome: "vestido", medidas: ["busto", "cintura", "quadril", "comprimento"] },
  { id: 5, nome: "saia", medidas: ["cintura", "quadril", "comprimento"] }
]

const initialForm = { categoria: 'blusa', name: '', description: '', sizes: [], image: '' }

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [adminView, setAdminView] = useState('create')
  const [selectedPieceIndex, setSelectedPieceIndex] = useState(null)

  const [pieces, setPieces] = useState(() => {
    try {
      const raw = localStorage.getItem('pieces')
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })
  const [form, setForm] = useState(initialForm)

  function handleLogin(e) {
    e.preventDefault()
    if (username.trim() && password.trim()) {
      setLoggedIn(true)
    }
  }

  function addSize() {
    const categoriaSelecionada = CATEGORIAS.find(c => c.nome === form.categoria)
    const medidas = categoriaSelecionada?.medidas || []
    
    const measurements = {}
    medidas.forEach(m => {
      if (m === 'busto') measurements.bust = ''
      else if (m === 'cintura') measurements.waist = ''
      else if (m === 'quadril') measurements.hips = ''
      else if (m === 'comprimento') measurements.length = ''
    })
    
    setForm(prev => ({
      ...prev,
      sizes: [...prev.sizes, { label: '', measurements }]
    }))
  }

  function updateSize(index, key, value) {
    setForm(prev => {
      const sizes = [...prev.sizes]
      if (key === 'label') sizes[index].label = value
      else sizes[index].measurements[key] = value
      return { ...prev, sizes }
    })
  }
  
  function removeSize(index) {
    setForm(prev => ({ ...prev, sizes: prev.sizes.filter((_, i) => i !== index) }))
  }

  function removePiece(index) {
    setPieces(prev => prev.filter((_, i) => i !== index))
    if (selectedPieceIndex === index) {
      setSelectedPieceIndex(null)
      setAdminView('list')
    }
  }

  function showPieceDetails(index) {
    setSelectedPieceIndex(index)
    setAdminView('details')
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) {
      alert('Por favor, preencha o nome da peça')
      return
    }
    setPieces(prev => [...prev, form])
    setForm(initialForm)
    setAdminView('list')
  }

  function handleImageChange(e) {
    const file = e.target.files && e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      setForm(prev => ({ ...prev, image: reader.result }))
    }
    reader.readAsDataURL(file)
  }

  function removeFormImage() {
    setForm(prev => ({ ...prev, image: '' }))
  }

  useEffect(() => {
    try {
      localStorage.setItem('pieces', JSON.stringify(pieces))
    } catch {
      // Ignore storage errors.
    }
  }, [pieces])




  function getMedidasCategoria() {
    const categoriaSelecionada = CATEGORIAS.find(c => c.nome === form.categoria)
    return categoriaSelecionada?.medidas || []
  }

  if (!loggedIn) {
    return (
      <div className='card card-step'>
        <div style={{ maxWidth: 520 }}>
          <p className='subtitle'>Area do Administrador</p>
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <div className='form-row'>
              <label>Usuario</label>
              <input value={username} onChange={e => setUsername(e.target.value)} />
            </div>
            <div className='form-row'>
              <label>Senha</label>
              <input type='password' value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <div className='card-footer'>
              <button className='btn-primary' type='submit'>Entrar</button>
            </div>
          </form>
          <div style={{ marginTop: 18 }}>
            <button className='btn-voltar' onClick={() => (location.hash = '')}>Voltar ao site</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='card card-step'>
      <div>
        <div className='admin-header'>
          <div>
            <p className='subtitle'>Área do Administrador</p>
          </div>
          <div className='admin-actions'>
          </div>
        </div>

        <div className='admin-nav'>
          <button
            type='button'
            className={`btn-editar ${adminView === 'create' ? 'ativo' : ''}`}
            onClick={() => setAdminView('create')}
          >
            Cadastrar peça
          </button>
          <button
            type='button'
            className={`btn-editar ${adminView === 'list' ? 'ativo' : ''}`}
            onClick={() => setAdminView('list')}
          >
            Ver peças cadastradas
          </button>
        </div>

        {adminView === 'create' && (
          <div className='admin-form admin-screen'>
            <form onSubmit={handleSubmit}>
            <div className='form-row'>
                <label>Selecione a categoria</label>
                <select name='categoria' value={form.categoria} onChange={handleChange}>
                  {CATEGORIAS.map(categoria => (
                    <option key={categoria.id} value={categoria.nome}>
                      {categoria.nome.charAt(0).toUpperCase() + categoria.nome.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div className='form-row'>
                <label>Nome</label>
                <input name='name' value={form.name} onChange={handleChange} required/>
              </div>
              {/* <div className='form-row'>
                <label>Descrição</label>
                <input name='description' value={form.description} onChange={handleChange} required/>
              </div>*/}

              <div className='form-row'>
                <label>Imagem</label>
                <input type='file' accept='image/*' onChange={handleImageChange} required/>
                {form.image && (
                  <div className='admin-image-preview'>
                    <img src={form.image} alt='Preview da peca' />
                    <button type='button' className='btn-editar' onClick={removeFormImage}>Remover imagem</button>
                  </div>
                )}
              </div>

              <div style={{ marginTop: 12 }}>
                <h3 style={{ margin: 0 }}>Tamanhos</h3>
                <p className='description' style={{ marginTop: 6 }}>
                  Adicione tamanhos e as medidas correspondentes.
                </p>


                {form.sizes.map((size, i) => (
                  <div key={i} className='card admin-size-card'>
                    <div className='admin-size-row'>
                      <div style={{ flex: 1 }}>
                        <div className='form-row'>
                          <label>Etiqueta (ex: P, M, G)</label>
                          <input value={size.label} onChange={e => updateSize(i, 'label', e.target.value)} />
                        </div>
                        <div className='formMedidas-cadastro' style={{ marginTop: 8 }}>
                          {getMedidasCategoria().includes('busto') && (
                            <div>
                              <label>Busto (cm)</label>
                              <input value={size.measurements.bust || ''} onChange={e => updateSize(i, 'bust', e.target.value)} />
                            </div>
                          )}
                          {getMedidasCategoria().includes('cintura') && (
                            <div>
                              <label>Cintura (cm)</label>
                              <input value={size.measurements.waist || ''} onChange={e => updateSize(i, 'waist', e.target.value)} />
                            </div>
                          )}
                          {getMedidasCategoria().includes('quadril') && (
                            <div>
                              <label>Quadril (cm)</label>
                              <input value={size.measurements.hips || ''} onChange={e => updateSize(i, 'hips', e.target.value)} />
                            </div>
                          )}
                          {getMedidasCategoria().includes('comprimento') && (
                            <div>
                              <label>Comprimento (cm)</label>
                              <input value={size.measurements.length || ''} onChange={e => updateSize(i, 'length', e.target.value)} />
                            </div>
                          )}
                        </div>
                      </div>
                      <button type='button' className='btn-editar' onClick={() => removeSize(i)}>Remover</button>
                    </div>
                  </div>
                ))}

                <div className='admin-form-actions'>
                  <button type='button' className='btn-primary' onClick={addSize}>Adicionar tamanho</button>
                </div>
              </div>

              <div className='card-footer' style={{ marginTop: 18 }}>
                <button className='btn-primary' type='submit'>Salvar</button>
              </div>
            </form>
          </div>
        )}

        {adminView === 'list' && (
          <div className='admin-pieces admin-screen'>
            <div className='admin-list-header'>
            </div>

            {pieces.length === 0 && <p className='description'>Nenhuma peça cadastrada.</p>}

            <div className='pieces-grid'>
              {pieces.map((piece, idx) => (
                <div key={idx} className='piece-card card'>
                  {piece.image && <img className='piece-image' src={piece.image} alt={piece.name} />}
                  <div className='piece-info'>
                    <h4 style={{ margin: '0 0 6px' }}>{piece.name}</h4>
                    <p className='description' style={{ margin: '0 0 8px' }}>{piece.description}</p>
                    <div className='sizes-row'>
                      {(piece.sizes ?? []).map((size, i) => (
                        <div key={i} className='size-badge'>
                          <div style={{ fontWeight: 700 }}>{size.label}</div>
                          <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                            {`Busto: ${size.measurements.bust}cm`} / {`Cintura: ${size.measurements.waist}cm`} / {`Quadril: ${size.measurements.hips}cm`} / {size.measurements.length && `Comprimento: ${size.measurements.length}cm`}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className='piece-actions'>
                      <button type='button' className='btn-editar' onClick={() => showPieceDetails(idx)}>Visualizar detalhes</button>
                      <button type='button' className='btn-excluir' onClick={() => removePiece(idx)}>Excluir</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {adminView === 'details' && pieces[selectedPieceIndex] && (
          <div className='admin-details admin-screen'>
            <button type='button' className='btn-voltar' onClick={() => setAdminView('list')}>
              Voltar
            </button>

            <div className='piece-details-grid'>
              <div className='piece-details-image'>
                {pieces[selectedPieceIndex].image ? (
                  <img src={pieces[selectedPieceIndex].image} alt={pieces[selectedPieceIndex].name} />
                ) : (
                  <div className='piece-details-placeholder'>Sem imagem</div>
                )}
              </div>
              
              <div className='piece-details-info'>
                <h3>{pieces[selectedPieceIndex].name}</h3>
                <p className='description' style={{ marginBottom: 12 }}>
                  <strong>Categoria:</strong> {pieces[selectedPieceIndex].categoria?.charAt(0).toUpperCase() + pieces[selectedPieceIndex].categoria?.slice(1) || 'Não especificada'}
                </p>
                <p className='description'>{pieces[selectedPieceIndex].description || 'Sem descricao cadastrada.'}</p>

                <h4>Medidas por tamanho</h4>
                <div className='details-sizes-grid'>
                  {(pieces[selectedPieceIndex].sizes ?? []).map((size, i) => (
                    <div key={i} className='details-size-card'>
                      <strong>{size.label}</strong>
                      <dl>
                        {size.measurements.bust && (
                          <div>
                            <dt>Busto</dt>
                            <dd>{size.measurements.bust} cm</dd>
                          </div>
                        )}
                        {size.measurements.waist && (
                          <div>
                            <dt>Cintura</dt>
                            <dd>{size.measurements.waist} cm</dd>
                          </div>
                        )}
                        {size.measurements.hips && (
                          <div>
                            <dt>Quadril</dt>
                            <dd>{size.measurements.hips} cm</dd>
                          </div>
                        )}
                        {size.measurements.length && (
                          <div>
                            <dt>Comprimento</dt>
                            <dd>{size.measurements.length} cm</dd>
                          </div>
                        )}
                      </dl>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}