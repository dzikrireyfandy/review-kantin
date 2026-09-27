import { Router } from 'express';
import { StallController } from '../controllers/stallController.ts';

const stallRouter = Router();
const stallController = new StallController();

stallRouter.get('/', (req, res) => {
  // #swagger.tags = ['Stalls']
  // #swagger.parameters['search']   = { in: 'query', type: 'string' }
  // #swagger.parameters['category'] = { in: 'query', type: 'string' }
  // #swagger.parameters['location'] = { in: 'query', type: 'string' }
  // #swagger.parameters['page']     = { in: 'query', type: 'integer' }
  // #swagger.parameters['limit']    = { in: 'query', type: 'integer' }
  // #swagger.responses[200] = { description: 'Daftar warung + meta pagination' }
  return stallController.getStalls(req, res);
});

stallRouter.post('/', (req, res) => {
  // #swagger.tags = ['Stalls']
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/StallInput' } }
  // #swagger.responses[201] = { description: 'Warung dibuat' }
  return stallController.createStall(req, res);
});

stallRouter.get('/:id', (req, res) => {
  // #swagger.tags = ['Stalls']
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  // #swagger.responses[200] = { description: 'Detail warung' }
  // #swagger.responses[404] = { description: 'Tidak ditemukan' }
  return stallController.getStallById(req, res);
});

stallRouter.put('/:id', (req, res) => {
  // #swagger.tags = ['Stalls']
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/StallInput' } }
  // #swagger.responses[200] = { description: 'Warung ter-update' }
  // #swagger.responses[404] = { description: 'Tidak ditemukan' }
  return stallController.updateStall(req, res);
});

stallRouter.delete('/:id', (req, res) => {
  // #swagger.tags = ['Stalls']
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  // #swagger.responses[200] = { description: 'Warung terhapus' }
  // #swagger.responses[404] = { description: 'Tidak ditemukan' }
  return stallController.deleteStall(req, res);
});

export { stallRouter };
