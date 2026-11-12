import type { CollectionConfig } from 'payload'

import { adminOnly, equipaOrSelf } from '../access'

/** Profissionais: entram só pela app (JWT), sem acesso ao /admin.
 *  A verificação pela equipa e os restantes campos entram nos sprints seguintes. */
export const Profissionais: CollectionConfig = {
  slug: 'profissionais',
  labels: { singular: 'Profissional', plural: 'Profissionais' },
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
