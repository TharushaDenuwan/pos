import React from "react";
import { type IconType } from "react-icons";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

import { FaCreditCard } from "react-icons/fa6";

export const SITE_NAME = "Maintenance Tracker";

export const CONTACTS = {
  email: "admin@donext.org",
  phone: "+94 70 123 4567",
  secondaryPhone: null,
  address: "Kandy, Sri Lanka",
};

export const SOCIALS: {
  social: string;
  icon: IconType;
  href: string;
}[] = [
  {
    social: "Facebook",
    href: "#",
    icon: FaFacebook,
  },
  {
    social: "Instagram",
    href: "#",
    icon: FaInstagram,
  },
  {
    social: "Twitter / X",
    href: "#",
    icon: FaXTwitter,
  },
];

/* Map of payment provider_id to their title and icon. Add in any payment providers you want to use. */
export const paymentInfoMap: Record<
  string,
  { title: string; icon: React.JSX.Element }
> = {
  pp_stripe_stripe: {
    title: "Credit card",
    icon: <FaCreditCard />,
  },
  pp_system_default: {
    title: "Manual Payment",
    icon: <FaCreditCard />,
  },
};
