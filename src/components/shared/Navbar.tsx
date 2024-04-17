"use client";
import { PiBarbellBold } from "react-icons/pi";
import { useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button,
} from "@nextui-org/react";

export default function LiftFeedNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = {
    Workout: "workout",
    Diet: "diet",
    Messages: "messages",
    Profile: "profile",
  };

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <Link href="/">
          <NavbarBrand className="flex gap-2">
            <PiBarbellBold className="w-8 h-8" />
            <p className="font-bold text-inherit">LIFT FEED</p>
          </NavbarBrand>
        </Link>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {Object.entries(menuItems).map(([key, value], index) => (
          <NavbarItem key={`${key}-${index}`}>
            <Link className="hover:underline" color="foreground" href={value}>
              {key}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <Button as={Link} color="primary" href="signup" variant="solid">
            Sign Up
          </Button>
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu>
        {Object.entries(menuItems).map(([key, value], index) => (
          <NavbarMenuItem key={`${key}-${index}`}>
            <Link className="w-full" href={value} size="lg">
              {key}
            </Link>
          </NavbarMenuItem>
        ))}
        <NavbarMenuItem>
          <Link href="/" size="lg">
            Logout
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}
