import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "Onchain Color",

  projectId:
    process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,

  chains: [mainnet],

  ssr: true,
});