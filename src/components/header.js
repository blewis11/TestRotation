import React from "react";

export default function Header({ onClick }) {
  return (
    <header>
      <div className="header-inner">
        <nav>
          <ul>
            <li className="btn">
              <a>order</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
