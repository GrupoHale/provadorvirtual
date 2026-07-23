import test from 'node:test';
import assert from 'node:assert/strict';
import { mapFormToPiece } from './normalizePiece.js';

test('mapFormToPiece converts admin form to API payload', () => {
  const form = {
    categoria: 'camisa',
    name: 'Camisa Básica',
    description: 'Descrição',
    image: 'data:image/png;base64,abc',
    sizes: [{ label: 'P', measurements: { bust: '90', waist: '70', hips: '95' } }]
  };

  const payload = mapFormToPiece(form);

  assert.equal(payload.nome, 'Camisa Básica');
  assert.equal(payload.categoria, 'camisa');
  assert.deepEqual(payload.tamanhos, [{ label: 'P', measurements: { bust: '90', waist: '70', hips: '95' } }]);
});