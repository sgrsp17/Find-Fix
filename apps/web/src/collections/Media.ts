import type { CollectionConfig } from 'payload'

import { adminOnly, authenticatedOnly } from '../access'

/** Ficheiros e imagens (fotografias de perfil, portfólio, pedidos e documentação). */
export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Ficheiro / Imagem', plural: 'Ficheiros e Imagens' },
  upload: {
    staticDir: 'media',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 512,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*', 'application/pdf'],
  },
  access: {
    read: () => true, // Imagens visíveis na app e no site
    create: authenticatedOnly,
    update: authenticatedOnly,
    delete: adminOnly,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Descrição / Texto alternativo',
    },
  ],
}
