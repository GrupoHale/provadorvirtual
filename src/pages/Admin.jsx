import { useState, useEffect } from 'react'
import '../App.css'

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [pieces, setPieces] = useState(() => {
    try {
      const raw = localStorage.getItem('pieces')
      return raw ? JSON.parse(raw) : []
    } catch (e) {
      return []
    }
  })
  const [form, setForm] = useState({ name: '', description: '', sizes: [], image: '' })

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
    setForm(prev => ({ ...prev, sizes: prev.sizes.filter((s, i) => i !== index) }))
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setPieces(prev => [...prev, form])
    setForm({ name: '', description: '', sizes: [], image: '' })
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
    } catch (e) {
      // ignore storage errors
    }
  }, [pieces])

  return (
    <div className='card card-step'>
      {!loggedIn ? (
        <div style={{ maxWidth: 520 }}>
          <p className='subtitle'>Área do Administrador</p>
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <div className='form-row'>
              <label>Usuário</label>
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
      ) : (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div>
              <p className='subtitle'>Área do Administrador</p>
              <h2>Cadastrar peça</h2>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className='btn-voltar' onClick={() => setLoggedIn(false)}>Logout</button>
              <button className='btn-voltar' onClick={() => (location.hash = '')}>Ir para site</button>
            </div>
          </div>

          <div className='admin-grid' style={{ marginTop: 18 }}>
            <div className='admin-form'>
              <form onSubmit={handleSubmit}>
                <div className='form-row'>
                  <label>Nome da peça</label>
                  <input name='name' value={form.name} onChange={handleChange} />
                </div>
                <div className='form-row'>
                  <label>Descrição</label>
                  <input name='description' value={form.description} onChange={handleChange} />
                </div>

                <div className='form-row'>
                  <label>Imagem da peça</label>
                  <input type='file' accept='image/*' onChange={handleImageChange} />
                  {form.image && (
                    <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
                      <img src={form.image} alt='preview' style={{ width: 120, height: 'auto', borderRadius: 8 }} />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <button type='button' className='btn-editar' onClick={removeFormImage}>Remover imagem</button>
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ marginTop: 12 }}>
                  <h3 style={{ margin: 0 }}>Tamanhos</h3>
                  <p className='description' style={{ marginTop: 6 }}>Adicione tamanhos e as medidas correspondentes.</p>

                  {form.sizes.map((size, i) => (
                    <div key={i} className='card' style={{ padding: 12, marginTop: 12 }}>
                      <div style={{ display: 'flex', gap: 12 }}>
                        <div style={{ flex: 1 }}>
                          <div className='form-row'>
                            <label>Etiqueta (ex: P, M, G)</label>
                            <input value={size.label} onChange={e => updateSize(i, 'label', e.target.value)} />
                          </div>
                          <div className='formMedidas' style={{ marginTop: 8 }}>
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
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
                          <button type='button' className='btn-editar' onClick={() => removeSize(i)}>Remover</button>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                    <button type='button' className='btn-primary' onClick={addSize}>Adicionar tamanho</button>
                    <div style={{ flex: 1 }} />
                  </div>
                </div>

                <div className='card-footer' style={{ marginTop: 18 }}>
                  <button className='btn-primary' type='submit'>Salvar peça</button>
                </div>
              </form>
            </div>

            <div className='admin-pieces'>
              <section>
                <h3>Peças cadastradas</h3>
                {pieces.length === 0 && <p className='description'>Nenhuma peça cadastrada ainda.</p>}
                <div className='pieces-grid' style={{ marginTop: 12 }}>
                  {pieces.map((p, idx) => (
                    <div key={idx} className='piece-card card'>
                      {p.image && <img className='piece-image' src={p.image} alt={p.name} />}
                      <div className='piece-info'>
                        <h4 style={{ margin: '0 0 6px' }}>{p.name}</h4>
                        <p className='description' style={{ margin: '0 0 8px' }}>{p.description}</p>
                        <div className='sizes-row'>
                          {p.sizes.map((s, i) => (
                            <div key={i} className='size-badge'>
                              <div style={{ fontWeight: 700 }}>{s.label}</div>
                              <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                                {s.measurements.bust} / {s.measurements.waist} / {s.measurements.hips} cm
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
