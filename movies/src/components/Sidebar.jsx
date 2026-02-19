export default function Sidebar() {
  const navItems = [
    { icon: "search", title: "Search" },
    { icon: "home", title: "Home", active: true },
    { icon: "tv", title: "TV Shows" },
    { icon: "movie", title: "Movies" },
    { icon: "trending", title: "New & Popular" },
    { icon: "plus", title: "My List" },
  ];

  const icons = {
    search: (
      <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
    ),
    home: (
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    ),
    tv: (
      <path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z" />
    ),
    movie: (
      <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z" />
    ),
    trending: (
      <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
    ),
    plus: (
      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
    ),
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon" />
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <a
            key={item.icon}
            href="#"
            className={`sidebar-item ${item.active ? "active" : ""}`}
            title={item.title}
          >
            <svg className="sidebar-icon" viewBox="0 0 24 24" fill="currentColor">
              {icons[item.icon]}
            </svg>
          </a>
        ))}
      </nav>
    </aside>
  );
}
