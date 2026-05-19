'use client'

import React from 'react'

interface TableCell {
  text: string
  html?: boolean
}

interface ContentBlock {
  type: 'paragraph' | 'heading3' | 'list' | 'table' | 'html'
  text?: string
  items?: string[]
  headers?: string[]
  rows?: TableCell[][]
  html?: string
}

interface Section {
  title: string
  content: ContentBlock[]
}

interface LegalPageData {
  title: string
  lastUpdated: string
  sections: Section[]
}

interface LegalPageProps {
  data: LegalPageData
}

function renderCell(cell: TableCell | string): React.ReactNode {
  const text = typeof cell === 'string' ? cell : cell.text
  const isHtml = typeof cell === 'object' && cell.html
  if (isHtml) {
    return <span dangerouslySetInnerHTML={{ __html: text }} />
  }
  return text
}

export default function LegalPage({ data }: LegalPageProps) {
  return (
    <div className="min-h-screen bg-white">
      <div className="container-custom max-w-3xl py-20">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">{data.title}</h1>
        <p className="text-gray-500 mb-12">{data.lastUpdated}</p>

        <div className="prose prose-gray max-w-none">
          {data.sections.map((section, sIdx) => (
            <section key={sIdx} className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{section.title}</h2>
              {section.content.map((block, bIdx) => {
                switch (block.type) {
                  case 'heading3':
                    return (
                      <h3
                        key={bIdx}
                        className="text-lg font-semibold text-gray-800 mb-2 mt-6"
                        dangerouslySetInnerHTML={{ __html: block.text || '' }}
                      />
                    )
                  case 'paragraph':
                    return (
                      <p
                        key={bIdx}
                        className="text-gray-600 leading-relaxed mb-4"
                        dangerouslySetInnerHTML={{ __html: block.text || '' }}
                      />
                    )
                  case 'list':
                    return (
                      <ul key={bIdx} className="list-disc list-inside text-gray-600 mb-4 space-y-1">
                        {block.items?.map((item, iIdx) => (
                          <li key={iIdx} dangerouslySetInnerHTML={{ __html: item }} />
                        ))}
                      </ul>
                    )
                  case 'table':
                    return (
                      <div key={bIdx} className="overflow-x-auto mb-4">
                        <table className="min-w-full border border-gray-200 text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              {block.headers?.map((h, hIdx) => (
                                <th
                                  key={hIdx}
                                  className="px-4 py-2 text-left font-semibold text-gray-900 border-b"
                                  dangerouslySetInnerHTML={{ __html: h }}
                                />
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {block.rows?.map((row, rIdx) => (
                              <tr key={rIdx}>
                                {row.map((cell, cIdx) => (
                                  <td
                                    key={cIdx}
                                    className={`px-4 py-2 ${rIdx < (block.rows?.length || 0) - 1 ? 'border-b' : ''}`}
                                  >
                                    {renderCell(cell)}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )
                  case 'html':
                    return (
                      <div
                        key={bIdx}
                        className="text-gray-600 leading-relaxed mb-4"
                        dangerouslySetInnerHTML={{ __html: block.html || '' }}
                      />
                    )
                  default:
                    return null
                }
              })}
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
