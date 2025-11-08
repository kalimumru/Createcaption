import { Button } from "@/components/ui/button";
import { NavLink } from "./NavLink";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <div className="text-2xl font-bold">
            <span className="text-foreground">Create</span>
            <span className="text-primary">Caption</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <NavLink to="/" className="text-foreground hover:text-primary transition-colors">
            Home
          </NavLink>
          <a href="#how-it-works" className="text-foreground hover:text-primary transition-colors">
            How it Works
          </a>
          <a href="#pricing" className="text-foreground hover:text-primary transition-colors">
            Pricing
          </a>
          <a href="#contact" className="text-foreground hover:text-primary transition-colors">
            Contact Us
          </a>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Button 
                variant="ghost" 
                className="text-foreground hover:text-primary"
                onClick={() => navigate("/dashboard")}
              >
                Dashboard
              </Button>
              <Button 
                variant="outline"
                onClick={signOut}
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="ghost" 
                className="text-foreground hover:text-primary"
                onClick={() => navigate("/auth")}
              >
                Log In
              </Button>
              <Button 
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                onClick={() => navigate("/auth")}
              >
                Sign Up Free
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
