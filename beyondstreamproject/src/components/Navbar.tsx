import logo from 'figma:asset/a6b8ce640962a17bd33cdd447ae70c2d8244dd6c.png';

export function Navbar() {
  return (
    <nav 
      className="w-full px-8 py-4"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
        backdropFilter: 'blur(10px)'
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <img 
          src={logo}
          alt="BeyondStreams"
          className="h-16 w-auto"
        />
        
        <div className="flex items-center gap-12">
          <a 
            href="#explore" 
            style={{ 
              fontFamily: 'var(--font-body)',
              color: 'var(--brand-text-secondary)',
              fontSize: '1rem'
            }}
            className="hover:opacity-70 transition-opacity"
          >
            Explore
          </a>
          <a 
            href="#how-it-works" 
            style={{ 
              fontFamily: 'var(--font-body)',
              color: 'var(--brand-text-secondary)',
              fontSize: '1rem'
            }}
            className="hover:opacity-70 transition-opacity"
          >
            How It Works
          </a>
          <button
            style={{
              fontFamily: 'var(--font-body)',
              backgroundColor: 'var(--brand-text-secondary)',
              color: '#ffffff',
              padding: '0.625rem 1.75rem',
              borderRadius: '1.5rem',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
            className="hover:opacity-90 transition-opacity"
          >
            Login
          </button>
        </div>
      </div>
    </nav>
  );
}