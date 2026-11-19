import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Avaliacoes } from './collections/Avaliacoes'
import { Clientes } from './collections/Clientes'
import { Diagnosticos } from './collections/Diagnosticos'
import { Equipa } from './collections/Equipa'
import { Marcacoes } from './collections/Marcacoes'
import { Media } from './collections/Media'
import { Portfolio } from './collections/Portfolio'
import { Profissionais } from './collections/Profissionais'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Origens autorizadas a chamar a API (a PWA noutro domínio). Separadas por vírgulas.
const allowedOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean)

export default buildConfig({
  admin: {
    user: Equipa.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Equipa,
    Clientes,
    Profissionais,
    Media,
    Marcacoes,
    Portfolio,
    Avaliacoes,
    Diagnosticos,
  ],
  cors: allowedOrigins,
  csrf: allowedOrigins,
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    // Em desenvolvimento o Payload sincroniza o esquema; em produção usam-se migrações.
    push: process.env.NODE_ENV !== 'production',
    // Declara o PostGIS: o Payload cria a extensão e o push ignora as tabelas/vistas dela
    // (sem isto, tenta apagá-las ou pergunta interativamente se são renames)
    extensions: ['postgis'],
  }),
  sharp,
  plugins: [],
})
