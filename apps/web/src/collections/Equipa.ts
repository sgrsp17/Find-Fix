import type { CollectionConfig } from 'payload'

import { adminOnly, equipaOnly } from '../access'

/** Equipa interna (suporte e admin técnico). Único login do /admin. */
export const Equipa: CollectionConfig = {
  slug: 'equipa',
  labels: { singular: 'Membro da equipa', plural: 'Equipa' },
  admin: { useAsTitle: 'email' },
  auth: true,
  access: {
    admin: ({ req: { user } }) => user?.collection === 'equipa',
    read: equipaOnly,
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  fields: [
    { name: 'nome', type: 'text', required: true },
    {
      name: 'perfil',
      type: 'select',
      required: true,
      defaultValue: 'suporte',
      options: [
        { label: 'Suporte', value: 'suporte' },
        { label: 'Admin técnico', value: 'admin' },
      ],
    },
  ],
}
