import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  ListMusic,
  Music,
  Cog,
  Newspaper,
  Bot,
  ChevronDown,
  ChevronUp,
  UserRound,
  Download,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AppBar = ({ selectedSection, setSection }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showMore, setShowMore] = useState(false);

  // Set section based on route path
  useEffect(() => {
    const path = location.pathname;

    if (path === "/") setSection("Music");
    else if (path.startsWith("/search")) setSection("Search");
    else if (path.startsWith("/account")) setSection("Account");
    else if (path.startsWith("/feedback")) setSection("Review");
    else if (path.startsWith("/settings")) setSection("Settings");
    else if (path.endsWith("/library")) setSection("Playlist");
    else if (path.startsWith("/library/saved")) setSection("Saved");
    else if (path.startsWith("/chat")) setSection("Chat");
    else setSection("");
  }, [location.pathname]);

  const navItems = [
    {
      label: "Music",
      icon: <Music size={20} />, 
      section: "Music",
      route: "/"
    },
    {
      label: "Explore",
      icon: <Search size={20} />, 
      section: "Search",
      route: "/search"
    },
    {
      label: "Chat",
      icon: <Bot size={20} />, 
      section: "Chat",
      route: "/chat"
    },
    {
        label: "Account",
        icon: <UserRound size={20} />,
        section: "Account",
        route: "/account"
    },
    {
      label: "More",
      icon: showMore ? <ChevronUp size={20} /> : <ChevronDown size={20} />,
      isMoreButton: true
    }
  ];

  const moreItems = [
    {
      label: "Settings",
      icon: <Cog size={18} />, 
      section: "Settings",
      route: "/settings"
    },
    {
      label: "Library",
      icon: <ListMusic size={18} />, 
      section: "Playlist",
      route: "/library"
    },
    {
      label: "Review",
      icon: <Newspaper size={18} />, 
      section: "Review",
      route: "/feedback"
    },
    {
        label: "Saved",
        icon: <Download size={18} />,
        section: "Saved",
        route: "/library/saved"
    }
  ];

  const handleNavClick = (item) => {
    if (item.isMoreButton) {
      setShowMore(!showMore);
      return;
    }
    
    setSection(item.section);
    navigate(item.route);
    window.scrollTo(0, 0);
    setShowMore(false);
  };

  const NavItem = ({ item, isActive, className = "" }) => (
    <motion.button
      onClick={() => handleNavClick(item)}
      whileTap={{ scale: 0.9 }}
      className={`w-12 h-14 flex flex-col justify-center items-center gap-1 rounded-xl transition-all duration-300 ${
        isActive ? "bg-white text-black" : "text-white hover:bg-white/10"
      } ${className}`}
    >
      {item.icon}
      <span className="text-xs font-medium leading-none">{item.label}</span>
    </motion.button>
  );

  const DropdownItem = ({ item, isActive }) => (
    <button
      onClick={() => handleNavClick(item)}
      className={`w-full flex items-center gap-3 text-sm px-3 py-2 rounded-lg transition-all duration-200 ${
        isActive
          ? "bg-white text-black"
          : "text-white hover:bg-white/10"
      }`}
    >
      {item.icon}
      <span className="font-medium">{item.label}</span>
    </button>
  );

  return (
    <nav className="z-[350] select-none bg-black text-white px-4 py-1 flex justify-center items-center shadow-2xl fixed bottom-0 left-0 w-full lg:px-20">
      <div className="flex items-center gap-2">
        {/* Main nav items */}
        {navItems.map((item, idx) => {
          if (item.isMoreButton) {
            return (
              <div key={idx} className="block lg:hidden relative">
                <NavItem 
                  item={item}
                  isActive={showMore}
                />

                <AnimatePresence>
                  {showMore && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: -8, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute bottom-15 left-1/8 transform -translate-x-1/2 bg-black border border-white/20 rounded-xl p-0 shadow-2xl min-w-36"
                    >
                      <div className="space-y-1 p-2">
                        {moreItems.map((moreItem, moreIdx) => (
                          <DropdownItem
                            key={moreIdx}
                            item={moreItem}
                            isActive={selectedSection === moreItem.section}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          }

          return (
            <NavItem
              key={idx}
              item={item}
              isActive={selectedSection === item.section}
            />
          );
        })}

        {/* Desktop more items */}
        <div className="hidden lg:flex items-center gap-2">
          {moreItems.map((item, idx) => (
            <NavItem
              key={idx}
              item={item}
              isActive={selectedSection === item.section}
            />
          ))}
        </div>
      </div>
    </nav>
  );
};

export default AppBar;