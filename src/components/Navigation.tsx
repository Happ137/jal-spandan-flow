import { NavLink } from "react-router-dom";
import { Home, BarChart3, MapPin, Database, Settings, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", icon: Home, label: "Overview" },
  { to: "/analysis", icon: TrendingUp, label: "Analysis" },
  { to: "/charts", icon: BarChart3, label: "Charts" },
  { to: "/map", icon: MapPin, label: "Map" },
  { to: "/data", icon: Database, label: "Data" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

export function Navigation() {
  return (
    <nav className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex space-x-8">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center space-x-2 py-4 px-2 border-b-2 text-sm font-medium transition-colors",
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
                )
              }
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}