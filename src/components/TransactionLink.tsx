import {
  faExclamationCircle,
  faSplotch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC, memo } from "react";
import { NavLink } from "react-router-dom";
import { transactionURL } from "../url";

type TransactionLinkProps = {
  txHash: string;
  fail?: boolean;
  blob?: boolean;
};

const TransactionLink: FC<TransactionLinkProps> = ({ txHash, fail, blob }) => (
  <span className="flex-no-wrap flex space-x-1">
    {fail && (
      <span className="text-red-600" title="Transaction reverted">
        <FontAwesomeIcon icon={faExclamationCircle} />
      </span>
    )}
    {blob && (
      <span className="text-rose-400" title="Blob transaction">
        <FontAwesomeIcon icon={faSplotch} />
      </span>
    )}
    <span className="truncate">
      <NavLink
        className="font-hash text-link-blue hover:text-link-blue-hover"
        to={transactionURL(txHash)}
      >
        <p className="truncate" data-test="tx-hash">
          {txHash}
        </p>
      </NavLink>
    </span>
  </span>
);

export default memo(TransactionLink);
