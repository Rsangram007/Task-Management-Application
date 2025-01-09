import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export function Navigation() {
  const { signOut } = useAuth();

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
       
        <div className="flex items-center space-x-4">
          <Link to="/">
            <Button variant="link" className="text-lg font-bold">
              Dashboard
            </Button>
          </Link>
          <Link to="/tasks">
            <Button variant="link" className="text-lg font-bold">
              Task list
            </Button>
          </Link>
        </div>

        {/* Desktop navigation buttons */}
        <div className="hidden md:flex space-x-4">
          <Button variant="outline" onClick={signOut}>
            Sign out
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center">
          <Button variant="outline" onClick={signOut}>
            Sign out
          </Button>
        </div>
      </div>
    </header>
  );
}
