import { getTxs } from "@lib/covalent";
import type { NextApiRequest, NextApiResponse } from "next";
import Cache from "lru-cache";

const ssrCache = new Cache({
  max: 100,
  maxAge: 1000 * 60 * 60, // 1hour
});

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { address: queryAddress = "" } = req.query;

  if (!queryAddress) {
    res.status(400).json({ error: "no address provided" } as unknown as Data);
  }

  const address =
    typeof queryAddress === "string" ? queryAddress : queryAddress[0];

  if (ssrCache.has(address)) {
    res.setHeader("x-cache", "HIT");
    const response = ssrCache.get(address);
    res.status(200).json(response as Data);
  }

  const tx = await getTxs(address);

  res.status(200).json(tx as unknown as Data);
}
