import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
const Navigation = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const navLinks = [
        { href: "#about", label: "About Us" },
        { href: "#fleet", label: "Our Fleet" },
        { href: "#services", label: "Services" },
        { href: "#routes", label: "Popular Routes" },
        { href: "#faq", label: "FAQ" },
        { href: "#contact", label: "About this beta" },
    ];
    const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (href.startsWith("#")) {
            e.preventDefault();
            const targetId = href.slice(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }
            setIsOpen(false);
        }
    };
    const isActive = (href: string) => {
        if (href.startsWith("/#"))
            return location.pathname === "/" && location.hash === href.slice(1);
        return location.pathname === href;
    };
    return (<nav className="fixed top-0 left-0 right-0 z-[9999] bg-black/60 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-3xl font-bold tracking-tight">nu<span className="text-gold">vora</span></span>
          </Link>

          
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => link.href.startsWith("#") ? (<a key={link.href} href={link.href} onClick={(e) => handleSmoothScroll(e, link.href)} className={`text-sm font-medium transition-colors hover:text-gold ${isActive(link.href) ? "text-gold" : "text-white"}`}>
                  {link.label}
                </a>) : (<Link key={link.href} to={link.href} className={`text-sm font-medium transition-colors hover:text-gold ${isActive(link.href) ? "text-gold" : "text-white"}`}>
                  {link.label}
                </Link>))}
          </div>

          
          <div className="hidden md:flex items-center space-x-4">
            
          </div>

          
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)} className="text-white" aria-label={isOpen ? "Close menu" : "Open menu"}>
              {isOpen ? (<X className="w-6 h-6"/>) : (<Menu className="w-6 h-6"/>)}
            </Button>
          </div>
        </div>

        
        {isOpen && (<div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-dark-secondary/90 backdrop-blur-lg rounded-lg mt-2">
              {navLinks.map((link) => link.href.startsWith("#") ? (<a key={link.href} href={link.href} onClick={(e) => handleSmoothScroll(e, link.href)} className={`block px-3 py-2 text-base font-medium transition-colors hover:text-gold ${isActive(link.href) ? "text-gold" : "text-white"}`}>
                    {link.label}
                  </a>) : (<Link key={link.href} to={link.href} className={`block px-3 py-2 text-base font-medium transition-colors hover:text-gold ${isActive(link.href) ? "text-gold" : "text-white"}`} onClick={() => setIsOpen(false)}>
                    {link.label}
                  </Link>))}
              
              
            </div>
          </div>)}
      </div>

      
      <div className="relative">
        
        <div className="h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent opacity-60"></div>
        
        <div className="absolute inset-0 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent blur-sm opacity-40"></div>
      </div>
    </nav>);
};
export default Navigation;
