import type { CollectionConfig } from 'payload'

import { adminOnly, equipaOrSelf } from '../access'

/** Clientes: entram só pela app (JWT), sem acesso ao /admin. */
export const Clientes: CollectionConfig = {
  slug: 'clientes',
  labels: { singular: 'Cliente', plural: 'Clientes' },
  admin: { useAsTitle: 'nome' },
  auth: { tokenExpiration: 60 * 60 * 24 * 7 },
  access: {
    admin: () => false,
    create: () => true, // registo aberto
    read: equipaOrSelf,
    update: equipaOrSelf,
    delete: adminOnly,
  },
  fields: [
    {
      name: 'nome',
      type: 'text',
      label: 'Nome completo',
      required: true,
    },
    {
      name: 'telemovel',
      type: 'text',
      label: 'Telemóvel',
    },
    {
      name: 'dataNascimento',
      type: 'date',
      label: 'Data de nascimento',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'nacionalidade',
      type: 'text',
      label: 'Nacionalidade',
      defaultValue: 'Portugal',
    },
    {
      name: 'localidade',
      type: 'text',
      label: 'Localidade / Cidade',
    },
    {
      name: 'morada',
      type: 'text',
      label: 'Morada',
    },
    {
      name: 'codigoPostal',
      type: 'text',
      label: 'Código postal',
    },
    {
      name: 'fotoPerfil',
      type: 'upload',
      relationTo: 'media',
      label: 'Fotografia de perfil',
    },
  ],
}
