"use client";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

type Props = {
  isMobile: boolean;
};

const NavItems: React.FC<Props> = ({ isMobile }) => {
  const pathname = usePathname();
  const params = useParams();
  const routes = [
    {
      href: `/`,
      label: "Home",
      active: pathname === `/`,
    },
    {
      href: `/courses`,
      label: "Courses",
      active: pathname === `/courses`,
    },
    {
      href: `/about`,
      label: "About",
      active: pathname === `/about`,
    },
    {
      href: `/police`,
      label: "Police",
      active: pathname === `/police`,
    },
    {
      href: `/faq`,
      label: "FAQ",
      active: pathname === `/faq`,
    },
  ];
  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {!isMobile ? (
        <div className="hidden lg:flex ">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={`text-[18px] px-6 font-[400] font-Poppins hover:text-[crimson] dark:hover:text-[#37a39a] 
           ${
             route.active
               ? "text-[crimson] dark:text-[#37a39a] font-semibold"
               : "text-muted-foreground dark:text-white text-black"
           }
          `}
            >
              {route.label}
            </Link>
          ))}
        </div>
      ) : (
        <div className="lg:hidden">
          <div className="w-full flex flex-col text-left py-6">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={`text-[18px] font-[400] mt-5 block font-Poppins hover:text-[crimson] dark:hover:text-[#37a39a] 
           ${
             route.active
               ? "text-[crimson] dark:text-[#37a39a] font-semibold"
               : "text-muted-foreground dark:text-white text-black"
           }
          `}
              >
                {route.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavItems;
