import type { CollectionConfig } from 'payload'

import { adminOnly, equipaOrSelf } from '../access'

/** Clientes: entram só pela app (JWT), sem acesso ao /admin. */
export const Clientes: CollectionConfig = {
  slug: 'clientes',
  admin: { useAsTitle: 'email' },
  auth: { tokenExpiration: 60 * 60 * 24 * 7 },
  access: {
    admin: () => false,
    create: () => true, // registo aberto
    read: equipaOrSelf,
    update: equipaOrSelf,
    delete: adminOnly,
  },
  fields: [{ name: 'nome', type: 'text', required: true }],
}
