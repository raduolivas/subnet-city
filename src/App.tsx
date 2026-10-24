import { useState } from 'react';

export default function App() {
  const [mode, setMode] = useState<'learn' | 'sandbox'>('learn');

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Build the network. Learn the logic.</p>
          <h1>Subnet City</h1>
        </div>
        <nav aria-label="Workspace mode">
          <button aria-pressed={mode === 'learn'} onClick={() => setMode('learn')}>Learn</button>
          <button aria-pressed={mode === 'sandbox'} onClick={() => setMode('sandbox')}>Sandbox</button>
        </nav>
      </header>

      <main>
        <section className="intro" aria-labelledby="workspace-title">
          <p className="eyebrow">Your networking workspace</p>
          <h2 id="workspace-title">{mode === 'learn' ? 'Start with a connection.' : 'A space to experiment.'}</h2>
          <p>{mode === 'learn'
            ? 'Learn how computers communicate, one cable, address, and packet at a time.'
            : 'The sandbox will let you build networks using every implemented device.'}</p>
          <p className="status" role="status">Foundation preview · Building and simulation are coming in later milestones.</p>
        </section>

        <div className="workspace-layout">
          <aside className="panel" aria-labelledby="guide-title">
            <p className="eyebrow">{mode === 'learn' ? 'First lesson' : 'Device library'}</p>
            <h2 id="guide-title">{mode === 'learn' ? 'Computers and cables' : 'Your future toolkit'}</h2>
            <p>{mode === 'learn'
              ? 'An Ethernet cable connects network ports so computers can exchange frames. A frame carries data across a local network.'
              : 'Computers and switches are planned for this release. Device placement and configuration are not available in this preview.'}</p>
            <p className="note">All future traffic is synthetic and stays inside the simulator.</p>
          </aside>

          <section className="workspace panel" aria-labelledby="canvas-title">
            <div className="workspace-heading">
              <h2 id="canvas-title">Network workspace</h2>
              <span className="badge">In development</span>
            </div>
            <div className="empty-workspace">
              <span className="network-mark" aria-hidden="true">◇</span>
              <h3>Your network starts here</h3>
              <p>The next milestones add devices, connections, and a deterministic packet simulator.</p>
            </div>
          </section>
        </div>
        <section className="panel timeline" aria-labelledby="timeline-title">
          <h2 id="timeline-title">Simulation events</h2>
          <p>No simulation has run. Packet events will appear here once the engine is implemented.</p>
        </section>
      </main>
    </div>
  );
}
