import { useState } from 'react'
import { Building2, ExternalLink, Globe } from 'lucide-react'

// Lista das 8 instituições envolvidas na rede INCITE Ecossistemas
export const INVOLVED_INSTITUTIONS = [
  {
    id: 'ba8c3b82-2316-4d71-b6d5-c4b880df38d7',
    acronym: 'UESC',
    name: 'Universidade Estadual de Santa Cruz',
    role: 'Instituição Coordenadora (LEAC/UESC)',
    url: 'https://www.uesc.br/',
    logoUrls: [
      '/logos/uesc.png',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Bras%C3%A3o_UESC.svg/240px-Bras%C3%A3o_UESC.svg.png',
      'https://www.google.com/s2/favicons?domain=uesc.br&sz=128',
    ],
  },
  {
    id: '18dfd196-764f-492d-b2c0-30c461434f57',
    acronym: 'UEFS',
    name: 'Universidade Estadual de Feira de Santana',
    role: 'Instituição Parceira',
    url: 'https://www.uefs.br/',
    logoUrls: [
      '/logos/uefs.png',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Bras%C3%A3o_da_UEFS.png/240px-Bras%C3%A3o_da_UEFS.png',
      'https://www.google.com/s2/favicons?domain=uefs.br&sz=128',
    ],
  },
  {
    id: 'F70B9dF8-57BF-433C-B250-98B56B89BDD1',
    acronym: 'UFSB',
    name: 'Universidade Federal do Sul da Bahia',
    role: 'Instituição Parceira',
    url: 'https://ufsb.edu.br/',
    logoUrls: [
      '/logos/ufsb.png',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Logo_UFSB.png/240px-Logo_UFSB.png',
      'https://www.google.com/s2/favicons?domain=ufsb.edu.br&sz=128',
    ],
  },
  {
    id: 'F460567A-6AA6-4D21-9E65-777D33ACA536',
    acronym: 'UFBA',
    name: 'Universidade Federal da Bahia',
    role: 'Instituição Parceira',
    url: 'https://www.ufba.br/',
    logoUrls: [
      '/logos/ufba.png',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Bras%C3%A3o_da_UFBA.svg/240px-Bras%C3%A3o_da_UFBA.svg.png',
      'https://www.google.com/s2/favicons?domain=ufba.br&sz=128',
    ],
  },
  {
    id: '96376a62-dd46-42af-9964-5de61e82b8e9',
    acronym: 'UESB',
    name: 'Universidade Estadual do Sudoeste da Bahia',
    role: 'Instituição Parceira',
    url: 'https://www.uesb.br/',
    logoUrls: [
      '/logos/uesb.png',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Bras%C3%A3o_da_UESB.png/240px-Bras%C3%A3o_da_UESB.png',
      'https://www.google.com/s2/favicons?domain=uesb.br&sz=128',
    ],
  },
  {
    id: 'CB406CE2-FB65-4649-91C1-ACD6C96545E8',
    acronym: 'IFBA',
    name: 'Instituto Federal de Educação, Ciência e Tecnologia da Bahia',
    role: 'Instituição Parceira',
    url: 'https://portal.ifba.edu.br/',
    logoUrls: [
      '/logos/ifba.png',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Logotipo_IFET.svg/240px-Logotipo_IFET.svg.png',
      'https://www.google.com/s2/favicons?domain=portal.ifba.edu.br&sz=128',
    ],
  },
  {
    id: '9e284f50-045d-4379-9bd5-7d163af354a2',
    acronym: 'UNIVASF',
    name: 'Universidade Federal do Vale do São Francisco',
    role: 'Instituição Parceira',
    url: 'https://portais.univasf.edu.br/',
    logoUrls: [
      '/logos/univasf.png',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Logo_UNIVASF.png/240px-Logo_UNIVASF.png',
      'https://www.google.com/s2/favicons?domain=univasf.edu.br&sz=128',
    ],
  },
  {
    id: 'adefe3bd-f700-4011-becd-8f56baed14e6',
    acronym: 'Arboretum',
    name: 'Programa Arboretum de Conservação e Restauração da Diversidade Florestal',
    role: 'Instituição Parceira',
    url: 'https://www.programaarboretum.eco.br/',
    logoUrls: [
      '/logos/arboretum.png',
      'https://www.google.com/s2/favicons?domain=programaarboretum.eco.br&sz=128',
    ],
  },
]

function InstitutionLogo({ institution }) {
  const [urlIndex, setUrlIndex] = useState(0)
  const urls = institution.logoUrls || []
  const currentUrl = urls[urlIndex]

  if (!currentUrl) {
    return (
      <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-sky-500 text-white flex flex-col items-center justify-center shadow-md">
        <Building2 className="h-7 w-7 mb-1 opacity-90" />
        <span className="text-xs font-extrabold tracking-tight px-1 truncate max-w-full">
          {institution.acronym}
        </span>
      </div>
    )
  }

  return (
    <div className="h-20 w-20 rounded-2xl bg-white border border-gray-100 p-2.5 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300">
      <img
        src={currentUrl}
        alt={`Logo ${institution.acronym}`}
        loading="lazy"
        onError={() => setUrlIndex((prev) => prev + 1)}
        className="max-h-full max-w-full object-contain"
      />
    </div>
  )
}

export default function InstitutionsSection({ institutions = INVOLVED_INSTITUTIONS }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-10 py-14">
      <header className="text-center max-w-3xl mx-auto mb-12">
        <p className="mb-2 text-xs md:text-sm font-semibold text-emerald-700 uppercase tracking-widest">
          Rede de Cooperação Científica
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-lime-500 to-sky-400">
            Instituições
          </span>{' '}
          que fazem parte
        </h2>
        <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed">
          Conheça as {institutions.length} instituições de ensino e pesquisa que integram o INCITE Restauração e Conservação de Ecossistemas Terrestres Baianos.
        </p>
      </header>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {institutions.map((inst) => (
          <li
            key={inst.id || inst.acronym}
            className="group relative flex flex-col justify-between bg-white/95 rounded-[2rem] p-6 shadow-md border border-gray-100 hover:shadow-xl hover:border-emerald-200 hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex flex-col items-center text-center">
              <InstitutionLogo institution={inst} />

              <span className="mt-4 inline-block rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/70 px-3.5 py-1 text-xs font-bold tracking-wide">
                {inst.acronym}
              </span>

              <h3 className="mt-3 text-base font-bold text-gray-800 leading-snug group-hover:text-emerald-700 transition-colors">
                {inst.name}
              </h3>

              {inst.role && (
                <p className="mt-1.5 text-xs text-gray-500 font-medium">{inst.role}</p>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-center">
              <a
                href={inst.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full rounded-full bg-emerald-50/80 hover:bg-emerald-600 text-emerald-800 hover:text-white px-4 py-2.5 text-xs font-semibold transition-all duration-200 shadow-sm"
              >
                <Globe className="h-3.5 w-3.5" />
                Acessar página oficial
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
