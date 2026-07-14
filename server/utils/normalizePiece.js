export function mapFormToPiece(form) {
  return {
    nome: form.name?.trim() || '',
    categoria: form.categoria?.trim().toLowerCase() || 'blusa',
    descricao: form.description?.trim() || '',
    imagem: form.image || '',
    tamanhos: (form.sizes || []).map((size) => ({
      label: size.label?.trim() || '',
      measurements: size.measurements || {}
    }))
  };
}
