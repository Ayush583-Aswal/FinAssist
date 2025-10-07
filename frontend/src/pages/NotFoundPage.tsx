import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
      <h1 className="mb-4 text-6xl font-bold text-foreground">404</h1>
        <p className="mb-8 text-xl text-muted-foreground">Oops! Page not found</p>
        <Button asChild className="gradient-primary">
          <Link to="/" className="gap-2">
            <Home className="h-4 w-4" />
            Return to Home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;