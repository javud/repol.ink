'use client';
import React from 'react';

const NavBar = () => {
  return (
    <nav>
      <div className="navBar">
        <div className="logoimg"></div>
        <div className="logotext">
          repo<span className="gradtext">l.ink</span>
        </div>
        <a href={"https://github.com/javud/repol.ink"} target="_blank" rel="noopener noreferrer"><div className="githubimg"></div></a>
      </div>
    </nav>
  );
};

export default NavBar;