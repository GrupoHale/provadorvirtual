import { useEffect, useState } from 'react'
import '../App.css'

const initialForm = { name: '', description: '', sizes: [], image: '' }

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false)
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
    setForm(prev => ({
      ...prev,
      sizes: [...prev.sizes, { label: '', measurements: { bust: '', waist: '', hips: '', length: '' } }]
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
            <button className='btn-voltar' onClick={() => setLoggedIn(false)}>Logout</button>
            <button className='btn-voltar' onClick={() => (location.hash = '')}>Ir para site</button>
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
                <label>Nome da peca</label>
                <input name='name' value={form.name} onChange={handleChange} />
              </div>
              <div className='form-row'>
                <label>Descricao</label>
                <input name='description' value={form.description} onChange={handleChange} />
              </div>

              <div className='form-row'>
                <label>Imagem da peca</label>
                <input type='file' accept='image/*' onChange={handleImageChange} />
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
                          <div>
                            <label>Busto (cm)</label>
                            <input value={size.measurements.bust} onChange={e => updateSize(i, 'bust', e.target.value)} />
                          </div>
                          <div>
                            <label>Cintura (cm)</label>
                            <input value={size.measurements.waist} onChange={e => updateSize(i, 'waist', e.target.value)} />
                          </div>
                          <div>
                            <label>Quadril (cm)</label>
                            <input value={size.measurements.hips} onChange={e => updateSize(i, 'hips', e.target.value)} />
                          </div>
                          <div>
                            <label>Comprimento (cm)</label>
                            <input value={size.measurements.length} onChange={e => updateSize(i, 'length', e.target.value)} />
                          </div>
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
                <button className='btn-primary' type='submit'>Salvar peça</button>
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
                            {size.measurements.bust} / {size.measurements.waist} / {size.measurements.hips} cm
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className='piece-actions'>
                      <button type='button' className='btn-editar' onClick={() => showPieceDetails(idx)}>Visualizar detalhes</button>
                      <button type='button' className='btn-editar' onClick={() => removePiece(idx)}>Excluir</button>
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
                <p className='description'>{pieces[selectedPieceIndex].description || 'Sem descricao cadastrada.'}</p>

                <h4>Medidas por tamanho</h4>
                <div className='details-sizes-grid'>
                  {(pieces[selectedPieceIndex].sizes ?? []).map((size, i) => (
                    <div key={i} className='details-size-card'>
                      <strong>{size.label}</strong>
                      <dl>
                        <div>
                          <dt>Busto</dt>
                          <dd>{size.measurements.bust || '-'} cm</dd>
                        </div>
                        <div>
                          <dt>Cintura</dt>
                          <dd>{size.measurements.waist || '-'} cm</dd>
                        </div>
                        <div>
                          <dt>Quadril</dt>
                          <dd>{size.measurements.hips || '-'} cm</dd>
                        </div>
                        <div>
                          <dt>Comprimento</dt>
                          <dd>{size.measurements.length || '-'} cm</dd>
                        </div>
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
