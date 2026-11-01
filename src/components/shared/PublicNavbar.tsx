import { getCookie } from "@/services/auth/tokenHandlers";
import { Menu, Stethoscope, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet";
import UserLogout from "./UserLogout";
import { ThemeToggle } from "../theme-toggle";

const PublicNavbar = async () => {
  const navItems = [
    { href: "/", label: "Home" },
    { href: "/consultation", label: "Consultation" },
    { href: "/health-plans", label: "Health Plans" },
    { href: "/medicine", label: "Medicine" },
    { href: "/diagnostics", label: "Diagnostics" },
    { href: "/ngos", label: "NGOs" },
  ];

  const accessToken = await getCookie("accessToken");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 transition-all">
      <div className="w-full max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Brand Logo */}
        <Link href="/" className="group flex items-center space-x-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary via-primary to-cyan-500 text-primary-foreground shadow-md shadow-primary/20 transition-transform duration-300 group-hover:scale-105">
            <Stethoscope className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-primary bg-clip-text text-transparent">
              WellSpace
            </span>
            <span className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground -mt-1 hidden sm:block">
              Clinical Care
            </span>
          </div>
        </Link>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center space-x-1 text-sm font-medium">
          {navItems.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="px-3 py-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-all duration-200"
            >
              {link.label}
            </Link>
          ))}
          {accessToken && (
            <Link
              href="/dashboard"
              className="px-3 py-1.5 rounded-full text-primary font-semibold hover:bg-primary/10 transition-all duration-200"
            >
              Dashboard
            </Link>
          )}
        </nav>

        {/* Right Actions */}
        <div className="hidden md:flex items-center space-x-2.5">
          <ThemeToggle />
          {accessToken ? (
            <UserLogout />
          ) : (
            <Link href="/login">
              <Button className="rounded-full px-5 font-medium shadow-sm hover:shadow-md transition-all">
                <Sparkles className="h-4 w-4 mr-1 text-primary-foreground/80" />
                Sign In
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center space-x-2">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-xl">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[300px] sm:w-[380px] p-6 glass-panel border-l border-border/50"
            >
              <SheetTitle className="text-lg font-bold flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Stethoscope className="h-4 w-4" />
                </div>
                <span>WellSpace Menu</span>
              </SheetTitle>
              <nav className="flex flex-col space-y-2 mt-8">
                {navItems.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="flex items-center px-4 py-2.5 rounded-xl text-base font-medium text-foreground hover:bg-accent/60 hover:text-primary transition-all"
                  >
                    {link.label}
                  </Link>
                ))}
                {accessToken && (
                  <Link
                    href="/dashboard"
                    className="flex items-center px-4 py-2.5 rounded-xl text-base font-semibold text-primary hover:bg-primary/10 transition-all"
                  >
                    Go to Dashboard
                  </Link>
                )}
                <div className="border-t border-border/60 pt-4 mt-4">
                  {accessToken ? (
                    <UserLogout />
                  ) : (
                    <Link href="/login" className="block w-full">
                      <Button className="w-full rounded-xl py-5">
                        Sign In / Register
                      </Button>
                    </Link>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default PublicNavbar;
