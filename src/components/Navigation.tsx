import { NavLink, useLocation } from "react-router-dom";
import { Home, BarChart3, MapPin, Database, TrendingUp, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

const dashboardItems = [
  { to: "/overview", icon: Eye, label: "Overview" },
  { to: "/analysis", icon: TrendingUp, label: "Analysis" },
  { to: "/charts", icon: BarChart3, label: "Charts" },
  { to: "/map", icon: MapPin, label: "Map" },
  { to: "/data", icon: Database, label: "Data" },
];

export function Navigation() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  if (isHome) {
    return (
      <nav className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="py-4">
            <NavLink 
              to="/"
              className="flex items-center space-x-2 text-lg font-semibold text-primary"
            >
              <Home className="h-5 w-5" />
              <span>Groundwater Monitoring</span>
            </NavLink>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between">
          <NavLink 
            to="/"
            className="flex items-center space-x-2 py-4 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <Home className="h-4 w-4" />
            <span>← Back to Home</span>
          </NavLink>
          
          <div className="flex space-x-8">
            {dashboardItems.map((item) => (
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
      </div>
    </nav>
  );
}