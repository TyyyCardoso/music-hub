import { NavLink } from "./NavLink";
import { Music, Map, Gamepad2, Calendar, Newspaper, Plane } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

const Navigation = () => {
  const navItems = [
    { to: "/", icon: Music, label: "Página principal" },
    { to: "/releases", icon: Calendar, label: "Lançamentos" },
    { to: "/news", icon: Newspaper, label: "Noticias" },
    { to: "/taylor-swift-tracker", icon: Plane, label: "Taylor Swift Tracker" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Music className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold gradient-text">Music Hub</span>
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
            {/* Games Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5 rounded-md">
                  <Gamepad2 className="w-5 h-5" />
                  <span className="hidden md:inline">Jogos</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <NavLink to="/game" className="flex items-center gap-2">
                    <Gamepad2 className="w-4 h-4" />
                    Adivinhe a música
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <NavLink to="/ninjagame" className="flex items-center gap-2">
                    <Gamepad2 className="w-4 h-4" />
                    Vinyl Slasher
                  </NavLink>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
