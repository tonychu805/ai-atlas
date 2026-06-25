import Link from 'next/link'

const TRENDING = [
  { label: 'Edge AI',          href: '/products' },
  { label: 'Power efficiency', href: '/products' },
  { label: 'HBM & packaging',  href: '/glossary/hbm' },
]

const LAYERS = [
  {
    row: 'Infrastructure',
    cards: [
      { title: 'Foundry & fabrication',     desc: 'IDM vs pure-play models, fab capacity, and the physical process — deposition, lithography, etch and more.', link: '/valuechain',                    linkLabel: 'Value chain' },
      { title: 'Materials & chemicals',      desc: 'Silicon wafers, photoresist, specialty gases and ultra-pure water feeding every step of the fab.',            link: '/glossary',                      linkLabel: 'Knowledge base' },
      { title: 'Equipment (WFE)',            desc: 'The machines that make it possible — ASML, Applied Materials, Tokyo Electron, KLA and more.',                 link: '/suppliers',                     linkLabel: 'Suppliers' },
    ],
  },
  {
    row: 'Architecture',
    cards: [
      { title: 'Advanced packaging',        desc: "Where 2026's gains come from as Moore's Law slows — CoWoS, fan-out, hybrid bonding and chiplet integration.", link: '/glossary/cowos',               linkLabel: 'Concept' },
      { title: 'Heterogeneous integration', desc: 'Combining many dies into one — chiplets, 3D stacking and through-silicon vias.',                               link: '/glossary/chiplet',             linkLabel: 'Concept' },
      { title: 'Design & IP',               desc: 'EDA software and architecture licensing — Synopsys, Cadence, Arm.',                                            link: '/suppliers',                    linkLabel: 'Suppliers' },
    ],
  },
  {
    row: 'Product',
    cards: [
      { title: 'Compute engines',           desc: 'CPUs, GPUs, TPUs and AI accelerators — the logic doing the work.',                                            link: '/products?tab=gpu',             linkLabel: 'Logic products' },
      { title: 'Memory & HBM',             desc: 'DRAM, NAND and the high-bandwidth memory feeding every AI accelerator.',                                       link: '/products?tab=memory',          linkLabel: 'Memory products' },
      { title: 'Power & analog',           desc: 'Silicon carbide and gallium nitride for EVs and high-power systems.',                                           link: '/products',                     linkLabel: 'Browse domain' },
      { title: 'Sensors & IoT',           desc: "MEMS, image sensors and edge devices at the network's edge.",                                                   link: '/products',                     linkLabel: 'Browse domain' },
    ],
  },
  {
    row: 'Application',
    cards: [
      { title: 'AI & data center',         desc: 'The accelerators, CPUs and HBM that train and serve large models.',                                            link: '/products?tab=gpu',             linkLabel: 'Datacenter silicon' },
      { title: 'Automotive & EV',          desc: 'Wide-bandgap power devices and the supply chain behind electrification.',                                       link: '/products',                     linkLabel: 'Browse domain' },
      { title: 'Consumer & edge',          desc: 'Mobile SoCs, sensors and low-power silicon in everyday devices.',                                              link: '/products',                     linkLabel: 'Browse domain' },
    ],
  },
]

export default function Home() {
  return (
    <div style={{ background: 'var(--background)' }} className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">

        {/* Hero */}
        <div className="max-w-2xl mb-10">
          <h1 className="text-4xl font-bold tracking-tight mb-4" style={{ color: '#0f172a' }}>
            The semiconductor industry, mapped.
          </h1>
          <p className="text-lg mb-8" style={{ color: '#6b6557', lineHeight: 1.6 }}>
            An open, structured database of chips, BOMs, supply chains, and supplier graphs — starting with AI accelerators and memory.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Link
              href="/learn"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-medium transition-opacity hover:opacity-90"
              style={{ background: '#0f172a', color: '#fff' }}
            >
              See how it&apos;s made →
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-gray-50"
              style={{ border: '1px solid #d6d3cb', color: '#0f172a' }}
            >
              Browse products
            </Link>
          </div>
          <p className="mt-5 text-sm" style={{ color: '#8a8579' }}>
            New here?{' '}
            <Link href="/learn" style={{ color: '#8a8579', textDecoration: 'underline', textDecorationStyle: 'dotted' as const }}>
              See how a chip is made, stage by stage →
            </Link>
          </p>
        </div>

        {/* Trending pills */}
        <div className="flex items-center gap-3 mb-14 flex-wrap">
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#a8a294' }}>Trending</span>
          {TRENDING.map(t => (
            <Link
              key={t.label}
              href={t.href}
              className="text-xs px-3 py-1.5 rounded-full border transition-colors hover:border-gray-400"
              style={{ borderColor: '#d6d3cb', color: '#3d3b37', background: '#fff' }}
            >
              {t.label}
            </Link>
          ))}
        </div>

        {/* Explore by Layer */}
        <div>
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#a8a294' }}>Explore by layer</p>
            <p className="text-sm" style={{ color: '#8a8579' }}>
              From the factory floor up to the finished application — five layers of the semiconductor stack.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {LAYERS.map(layer => (
              <div key={layer.row} className="flex gap-4 items-start">
                {/* Row label */}
                <div className="w-24 shrink-0 pt-4 hidden sm:block">
                  <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#a8a294' }}>{layer.row}</span>
                </div>
                {/* Cards */}
                <div className={`flex-1 grid gap-3 ${layer.cards.length === 4 ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-3'}`}>
                  {layer.cards.map(card => (
                    <div
                      key={card.title}
                      className="rounded-xl border p-4"
                      style={{ borderColor: '#e5e2db', background: '#fff' }}
                    >
                      <p className="font-semibold text-sm mb-1.5" style={{ color: '#0f172a' }}>{card.title}</p>
                      <p className="text-xs mb-4" style={{ color: '#8a8579', lineHeight: 1.6 }}>{card.desc}</p>
                      <Link
                        href={card.link}
                        className="text-xs font-medium transition-colors hover:underline"
                        style={{ color: '#9a6b3f' }}
                      >
                        {card.linkLabel} →
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
