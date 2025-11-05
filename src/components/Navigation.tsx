import { NavLink } from "./NavLink";
import { Music, Map, Gamepad2, Calendar, Newspaper, Plane } from "lucide-react";

const Navigation = () => {
  const navItems = [
    { to: "/", icon: Music, label: "Home" },
    { to: "/world-map", icon: Map, label: "World Music" },
    { to: "/game", icon: Gamepad2, label: "Guess the Music" },
    { to: "/releases", icon: Calendar, label: "Releases" },
    { to: "/news", icon: Newspaper, label: "News" },
    { to: "/taylor-swift-tracker", icon: Plane, label: "TS Tracker" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Music className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold gradient-text">Global Music Hub</span>
          </div>
          
          <div className="flex items-center gap-6">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                activeClassName="text-primary"
              >
                <Icon className="w-5 h-5" />
                <span className="hidden md:inline">{label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
