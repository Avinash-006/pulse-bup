import clsx from "clsx";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { NavItems, adminNavItems } from "../Constants/Constants";
import { getUser, removeToken, removeUser } from "../utils/auth";

const Navbar = ({ isAudioPlaying, setIsAudioPlaying, audioElementRef }) => {
  const [user, setUser] = useState(getUser());
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  const ProfileDropdown = () => (
    <div className="relative" ref={profileRef}>
      <button
        onClick={() => setIsProfileOpen(!isProfileOpen)}
        className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors"
      >
        <div className="h-10 w-10 rounded-full font-bold text-white">
          {user?.fullName?.charAt(0)?.toUpperCase() || "?"}
        </div>
        <span className="font-medium">{user?.fullName || "User"}</span>
      </button>

      {isProfileOpen && (
        <div className="absolute right-0 z-50 mt-3 w-72 rounded-xl border border-white/10 bg-black py-2 shadow-2xl ">
          <div className="border-b border-white/10 px-6 py-4">
            <p className="text-lg font-semibold text-white">{user?.fullName}</p>
            <p className="text-sm text-gray-300">{user?.email}</p>
          </div>
          <div className="border-b border-white/10 px-6 py-4">
            <p className="mt-2 flex justify-between text-sm text-gray-300">
              <span>ID:</span>
              <span className="text-white">{user?.collegeId}</span>
            </p>
          </div>
          <div className="px-4 py-3">
            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-black py-2.5 font-medium text-white transition-all duration-300 hover:bg-white hover:text-black"
            >
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const MobileProfile = () => (
    <div className="mt-6 border-t border-white/10 pt-6">
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full font-bold text-white shadow-lg">
          {user?.fullName?.charAt(0)?.toUpperCase() || "?"}
        </div>
        <div>
          <p className="text-lg font-semibold text-white">
            {user?.fullName || "User"}
          </p>
          <p className="text-sm text-gray-300">{user?.email}</p>
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-black py-3 font-medium text-white transition-all duration-300 hover:bg-white hover:text-black"
      >
        <span>Logout</span>
      </button>
    </div>
  );

  const isAdmin = user?.role === "admin";
  const navigationLinks = isAdmin ? [...NavItems, adminNavItems] : NavItems;

  useEffect(() => {
    const handleStorageChange = () => setUser(getUser());
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
  }, [isOpen]);

  const handleLogout = () => {
    removeToken();
    removeUser();
    setUser(null);
    setIsProfileOpen(false);
    setIsOpen(false);
    navigate("/login");
  };

  const navContainerRef = useRef(null);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const lastScrollYRef = useRef(0);
  const tickingRef = useRef(false);

  // Function to toggle the audio state
  const toggleAudioIndicator = () => {
    if (audioElementRef.current) {
      const newAudioState = !isAudioPlaying;
      setIsAudioPlaying(newAudioState);
      localStorage.setItem(
        "audio_preference",
        newAudioState ? "enabled" : "disabled"
      );
    }
  };

  useEffect(() => {
    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(() => {
        const y = window.scrollY || 0;
        if (y <= 10) {
          setIsNavVisible(true);
          if (navContainerRef.current) navContainerRef.current.classList.remove("floating-nav");
          lastScrollYRef.current = 0;
        } else {
          if (navContainerRef.current) navContainerRef.current.classList.add("floating-nav");
          const wasScrollingDown = y > lastScrollYRef.current;
          setIsNavVisible(!wasScrollingDown);
          lastScrollYRef.current = y;
        }
        tickingRef.current = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    gsap.to(navContainerRef.current, {
      y: isNavVisible ? 0 : -120,
      duration: 0.3,
      ease: "power2.out",
    });
  }, [isNavVisible]);

  return (
    <div className="overflow-x-hidden">
      <div
        ref={navContainerRef}
        className="fixed inset-x-0 top-4 z-50 h-16 transition-all duration-700 sm:inset-x-6"
      >
        <header className="absolute top-1/2 w-full -translate-y-1/2">
          <div className="flex items-center justify-between">
            <img className="w-28 mt-5 h-20" src="/img/pulse-logo.png" alt="" />
            <nav className="flex size-full items-center justify-center p-4 text-2xl font-bold">
              <div className="flex h-full items-center">
                <div className="hidden md:block">
                  {navigationLinks.map((item, index) => (
                    <NavLink
                      to={item.to}
                      key={index}
                      className="nav-hover-btn cursor-target px-4 py-2"
                    >
                      {item.title}
                    </NavLink>
                  ))}
                </div>
                <button
                  onClick={toggleAudioIndicator}
                  className="ml-10 flex cursor-pointer items-center space-x-0.5"
                >
                  {[1, 2, 3, 4].map((bar) => (
                    <div
                      key={bar}
                      className={clsx("indicator-line", {
                        active: isAudioPlaying,
                      })}
                      style={{ animationDelay: `${bar * 0.1}s` }}
                    />
                  ))}
                </button>
              </div>
            </nav>

            <div className="flex items-center gap-4">
              <div className="hidden lg:block">
                {user ? (
                  <ProfileDropdown />
                ) : (
                  <div className="flex gap-4">
                    <NavLink
                      to="/login"
                      className="cursor-target rounded-md bg-green-600/95 px-6 py-2 font-bold text-black transition-colors hover:bg-green-700"
                    >
                      Login
                    </NavLink>
                    <NavLink
                      to="/register"
                      className="cursor-target rounded-md border-2 border-green-600 bg-transparent mr-4 px-6 py-2 font-bold text-white transition-all hover:text-red-500"
                    >
                      Register
                    </NavLink>
                  </div>
                )}
              </div>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative z-50 flex h-10 w-12 items-center justify-center rounded-lg border border-white/10 bg-black/30 text-white transition-all duration-300 hover:bg-black/50 focus:outline-none lg:hidden"
              >
                <div className="relative flex h-4 w-5 flex-col justify-between">
                  <span
                    className={`block h-0.5 rounded-full bg-white transition-all duration-300 ${isOpen ? "w-5 translate-y-1.5 rotate-45" : "w-5"
                      }`}
                  ></span>
                  <span
                    className={`block h-0.5 rounded-full bg-white transition-all duration-300 ${isOpen ? "w-5 opacity-0" : "ml-1 w-4"
                      }`}
                  ></span>
                  <span
                    className={`block h-0.5 rounded-full bg-white transition-all duration-300 ${isOpen ? "w-5 -translate-y-1.5 -rotate-45" : "ml-2 w-3"
                      }`}
                  ></span>
                </div>
              </button>
            </div>
          </div>
        </header>
      </div>

      <div
        className={clsx(
          "fixed inset-0 bg-black right-0 top-0 z-40 h-full w-full transform  transition-all duration-500 ease-in-out lg:hidden",
          {
            "translate-x-0 opacity-100": isOpen,
            "translate-x-full opacity-0": !isOpen,
            "is-open": isOpen,
          }
        )}
      >
        <div className="flex h-full w-full flex-col items-center justify-between p-8 pt-24">
          <div className="flex w-full flex-col gap-4">
            {navigationLinks.map((link, index) => (
              <NavLink
                key={link.title}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  clsx(
                    "menu-item w-full rounded-xl px-6 py-4 text-center text-2xl font-semibold transition-all duration-300 ease-in-out",
                    {
                      "bg-white bg-gradient-to-r text-black shadow-lg":
                        isActive,
                      "text-white hover:bg-white/10": !isActive,
                    }
                  )
                }
                style={{ "--delay": `${index * 0.1}s` }}
              >
                {link.title}
              </NavLink>
            ))}
          </div>

          <div className="w-full">
            {user ? (
              <MobileProfile />
            ) : (
              <div className="mt-4 flex w-full flex-col gap-4">
                <NavLink
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="cursor-target rounded-xl bg-green-500 px-6 py-3 text-center text-lg font-medium text-black transition-all hover:bg-gray-200"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl border-2 border-green-500 bg-transparent px-6 py-3 text-center text-lg font-medium text-white transition-all hover:bg-white hover:text-black"
                >
                  Register
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
