"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export default function Header() {
  const pathname = usePathname();
  
  if (pathname == "/" || pathname.startsWith("/dashboard") || pathname.startsWith("/login")) {
    return null;
  }

  const handleLogout = () => {
    signOut({callbackUrl: "/"});
  }

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <NavigationMenu>
          <NavigationMenuList>
            {!pathname.startsWith("/orders") && (
              <>
                <NavigationMenuItem>
                  <Link href="/sales" className={navigationMenuTriggerStyle()}>
                    Sales
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/products" className={navigationMenuTriggerStyle()}>
                    Products
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/category" className={navigationMenuTriggerStyle()}>
                    Category
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/promo" className={navigationMenuTriggerStyle()}>
                    Promo
                  </Link>
                </NavigationMenuItem>
              </>
            )}
          </NavigationMenuList>
        </NavigationMenu>

        <Button 
          variant="destructive" 
          size="sm" 
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </header>
  );
}