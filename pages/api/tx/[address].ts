import { getTxs } from "@lib/covalent";
import type { NextApiRequest, NextApiResponse } from "next";
import Cache from "lru-cache";

// const ssrCache = new Cache({
//   max: 100,
//   ttl: 1000 * 60 * 60, // 1hour
// });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { address: queryAddress = "" } = req.query;

  if (!queryAddress) {
    res.status(400).json({ error: "no address provided" } as any);
  }

  const address =
    typeof queryAddress === "string" ? queryAddress : queryAddress[0];

  // if (ssrCache.has(address)) {
  //   res.setHeader("x-cache", "HIT");
  //   const response = ssrCache.get(address);
  //   res.status(200).json(response as any);
  // }

  const tx = await getTxs(address);

  res.status(200).json(tx as any);
}
