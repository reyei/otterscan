import { faEthereum } from "@fortawesome/free-brands-svg-icons";
import { faBurn, faCoins } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext } from "react";
import FormattedBalance from "../../components/FormattedBalance";
import PercentageGauge from "../../components/PercentageGauge";
import { TransactionData } from "../../types";
import { useChainInfo } from "../../useChainInfo";
import { useBlockDataFromTransaction } from "../../useErigonHooks";
import { RuntimeContext } from "../../useRuntime";
import { multiplyByScalar } from "../op-tx-calculation";

type RewardSplitProps = {
  txData: TransactionData;
};

// Only can be shown when gasPrice is defined
const RewardSplit: React.FC<RewardSplitProps> = ({ txData }) => {
  const { provider } = useContext(RuntimeContext);
  const block = useBlockDataFromTransaction(provider, txData);

  const {
    nativeCurrency: { symbol },
  } = useChainInfo();
  const paidFees = txData.confirmedData!.fee;
  const burntFees = block
    ? block.baseFeePerGas! * txData.confirmedData!.gasUsed
    : 0n;

  let l1Fees = 0n;
  if (
    txData.confirmedData &&
    txData.confirmedData.l1GasUsed &&
    txData.confirmedData.l1GasPrice &&
    txData.confirmedData.l1FeeScalar !== undefined
  ) {
    l1Fees = multiplyByScalar(
      txData.confirmedData.l1GasUsed * txData.confirmedData.l1GasPrice,
      txData.confirmedData.l1FeeScalar,
    );
  }

  const minerReward = paidFees - burntFees - l1Fees;
  // Optimism: paidFees === 0n for deposit transactions
  const burntPerc =
    paidFees === 0n ? 0 : Number((burntFees * 10000n) / paidFees) / 100;
  const l1Perc = Number((l1Fees * 10000n) / paidFees) / 100;
  const minerPerc = Math.round((100 - burntPerc - l1Perc) * 100) / 100;

  return (
    <div className="inline-block">
      <div className="grid grid-cols-2 items-center gap-x-2 gap-y-1 text-sm">
        <PercentageGauge
          perc={burntPerc}
          bgColor="bg-orange-100"
          bgColorPerc="bg-orange-500"
          textColor="text-orange-800"
        />
        <div className="flex items-baseline space-x-1">
          <span className="flex space-x-1 text-orange-500">
            <span title="Burnt fees">
              <FontAwesomeIcon icon={faBurn} size="1x" />
            </span>
            <span>
              <span className="line-through">
                <FormattedBalance value={burntFees} />
              </span>{" "}
              {symbol}
            </span>
          </span>
        </div>
        <PercentageGauge
          perc={minerPerc}
          bgColor="bg-amber-100"
          bgColorPerc="bg-amber-300"
          textColor="text-amber-700"
        />
        <div className="flex items-baseline space-x-1">
          <span className="flex space-x-1">
            <span className="text-amber-300" title="Miner fees">
              <FontAwesomeIcon icon={faCoins} size="1x" />
            </span>
            <span>
              <FormattedBalance value={minerReward} symbol={symbol} />
            </span>
          </span>
        </div>
        <PercentageGauge
          perc={l1Perc}
          bgColor="bg-blue-100"
          bgColorPerc="bg-blue-300"
          textColor="text-blue-700"
        />
        <div className="flex items-baseline space-x-1">
          <span className="flex space-x-1">
            <span className="text-blue-300" title="L1 Security fees">
              <FontAwesomeIcon icon={faEthereum} size="1x" />
            </span>
            <span>
              <FormattedBalance value={l1Fees} /> {symbol}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(RewardSplit);
