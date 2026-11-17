import type { CollectionConfig } from 'payload'

import { adminOnly, authenticatedOnly } from '../access'

/** Avaliações e comentários recebidos pelos Profissionais. */
export const Avaliacoes: CollectionConfig = {
  slug: 'avaliacoes',
  labels: { singular: 'Avaliação', plural: 'Avaliações' },
  admin: {
    useAsTitle: 'comentario',
    defaultColumns: ['profissional', 'cliente', 'classificacao', 'createdAt'],
  },
  access: {
    read: () => true, // Públicas para serem exibidas nos perfis dos especialistas
    create: authenticatedOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  fields: [
    {
      name: 'profissional',
      type: 'relationship',
      relationTo: 'profissionais',
      label: 'Profissional avaliado',
      required: true,
    },
    {
      name: 'cliente',
      type: 'relationship',
      relationTo: 'clientes',
      label: 'Cliente que avaliou',
      required: true,
    },
    {
      name: 'marcacao',
      type: 'relationship',
      relationTo: 'marcacoes',
      label: 'Marcação associada (opcional)',
    },
    {
      name: 'classificacao',
      type: 'number',
      label: 'Classificação (1 a 5 estrelas)',
      required: true,
      min: 1,
      max: 5,
    },
    {
      name: 'comentario',
      type: 'textarea',
      label: 'Comentário sobre o serviço',
    },
  ],
}
