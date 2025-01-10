
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import styled from "styled-components";

export function Navigation() {
  const { signOut } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Initialize from localStorage or default to false
    return localStorage.getItem("theme") === "dark";
  });

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    document.documentElement.classList.toggle("dark", newTheme);

    // Save the theme preference to localStorage
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  useEffect(() => {
    // Apply the theme on initial load
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <header className="border-b bg-white dark:bg-gray-900 dark:text-white">
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

        {/* Theme Toggle Button */}
        <div className="flex items-center space-x-4">
          <ToggleSwitch isChecked={isDarkMode} onChange={toggleTheme} />
          <Button variant="outline" onClick={signOut}>
            Sign out
          </Button>
        </div>
      </div>
    </header>
  );
}

// Toggle Switch Component
const ToggleSwitch = ({
  isChecked,
  onChange,
}: {
  isChecked: boolean;
  onChange: () => void;
}) => {
  return (
    <StyledSwitch>
      <input
        type="checkbox"
        id="theme-toggle"
        checked={isChecked}
        onChange={onChange}
      />
      <label htmlFor="theme-toggle" className="switch"></label>
    </StyledSwitch>
  );
};

// Styled Components for Toggle Switch
const StyledSwitch = styled.div`
  .switch {
    position: relative;
    display: inline-block;
    width: 48px;
    height: 24px;
    background-color: #ccc;
    border-radius: 24px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .switch::before {
    content: "";
    position: absolute;
    top: 2px;
    left: 2px;
    width: 20px;
    height: 20px;
    background-color: #fff;
    border-radius: 50%;
    transition: transform 0.3s;
  }

  input[type="checkbox"] {
    display: none;
  }

  input[type="checkbox"]:checked + .switch {
    background-color: #4caf50;
  }

  input[type="checkbox"]:checked + .switch::before {
    transform: translateX(24px);
  }
`;
