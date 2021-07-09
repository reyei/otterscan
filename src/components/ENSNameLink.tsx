import React from "react";
import { NavLink } from "react-router-dom";
import ENSLogo from "./ensLogo.svg";

type ENSNameLinkProps = {
  name: string;
  address: string;
};

const ENSNameLink: React.FC<ENSNameLinkProps> = ({ name, address }) => (
  <NavLink
    className="flex items-baseline space-x-1 font-sans text-link-blue hover:text-link-blue-hover truncate"
    to={`/address/${name}`}
    title={`${name}: ${address}`}
  >
    <img
      className="self-center"
      src={ENSLogo}
      alt="ENS Logo"
      width={12}
      height={12}
    />
    <p className="truncate">{name}</p>
  </NavLink>
);

export default React.memo(ENSNameLink);
