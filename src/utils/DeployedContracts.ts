import { DeployedContractDetail } from '../../types/Contracts';

/**
 * Lists currently deployed base contract addresses, by network.
 * 4 = Rinkeby
 */
export const DeployedBaseContracts: DeployedContractDetail = {
  4: {
    "MarketCollateralPool": "0xc08bb40b09619b7b547df9b6e5b8716cbc8c22ed",
    "MarketContractFactoryOraclize": "0xe9fd3a700ea865111ea396ec5ac0984816e86999",
    "MarketContractOraclize": "",
    "MarketContractRegistry": "0xd265af45edb633c4cfcd2e09dc9527bd53bd5ece",
    "MarketToken": "0xd0620d683d744d16928844d4070475aa4974eea4",
    "MathLib": "0xd7fd2271fb3eb99ff289b1cd8d621918c7f2b90c",
    "Migrations": "0xc328bab34352c2583fee46e432cfb26c50f79034",
    "OraclizeQueryTest": "0xafa265cb99d64f0548a9e9ba9425a3e3d6f014e8",
    "OrderLib": "0x535d4505139246bb8d00a46ff688bdf77f0f0ebe",
    "Ownable": ""
  }
}

/**
 * Lists currently deployed SimEx contract addresses, by network.
 * 4 = Rinkeby
 */
export const DeployedSimExContracts: DeployedContractDetail = {
  4: {
    "TradableContracts": [],
    "MarketCollateralPools": [],
    "MarketContractRegistry": ""
  }
}