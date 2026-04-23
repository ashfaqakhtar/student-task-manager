"use client";

import { useEffect, useRef, useState } from "react";
import Button from "../UI/Button";

export default function Navbar({ user, onLogout, onOpenChangePassword }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function onClickOutside(event) {
      if (!menuRef.current?.contains(event.target)) {
        setOpen(false);
      }
    }

    window.addEventListener("mousedown", onClickOutside);
    return () => window.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <header className="navbar">
      <div className="navbar__brand">
        <strong>Smart Study Planner</strong>
        <span>Coursework, deadlines, focus, and admin oversight.</span>
      </div>
      <div className="navbar__profile" ref={menuRef}>
        <button className="navbar__profile-trigger" onClick={() => setOpen((value) => !value)}>
          <span className="navbar__avatar">{user.name.slice(0, 1).toUpperCase()}</span>
          <span className="navbar__identity">
            <strong>{user.name}</strong>
            <span>{user.role}</span>
          </span>
        </button>
        {open ? (
          <div className="navbar__menu">
            <button
              onClick={() => {
                setOpen(false);
                onOpenChangePassword();
              }}
            >
              Change password
            </button>
            <button
              onClick={() => {
                setOpen(false);
                onLogout();
              }}
            >
              Logout
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
}
