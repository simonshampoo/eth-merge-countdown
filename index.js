import axios from "axios";
import { ethers } from "ethers";
import * as dotenv from 'dotenv'
const TTD_TILL_MERGE = "58750000000000000000000";

dotenv.config()

const getBlockNumber = async () => {
  let res;
  try {
    const body = JSON.stringify({
      jsonrpc: "2.0",
      method: "eth_blockNumber",
      params: [],
      id: 1,
    });
    res = await axios.post(
      `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (e) {
    console.log(e);
  }
  return res.data.result;
};

const getTotalBlockDifficulty = async () => {
  let res;
  try {
    const body = JSON.stringify({
      jsonrpc: "2.0",
      method: "eth_getBlockByNumber",
      params: ["latest", false],
      id: 1,
    });
    res = await axios.post(
      `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (e) {
    console.log(e);
  }
  return ethers.BigNumber.from(res.data.result.totalDifficulty);
};

let prev;
let prevTime;
let avgTime = 0;
let i = 0;
setInterval(async () => {
  const ttd = ethers.BigNumber.from(TTD_TILL_MERGE);
  const bd = await getTotalBlockDifficulty();
  const diff = ttd.sub(bd).toString();
  if (diff !== prev) {
    prev = diff;
    const delta = Number(((new Date().getTime() - prevTime) / 1000) % 60);
    console.table([
      ["BLOCK # MINED", Number(await getBlockNumber())],
      ["TTD:", ttd.toString()],
      ["Total Block Difficulty:", bd.toString()],
      ["Remaining Difficulty:", diff.toString()],
      ["Time elapsed since last block:", delta],
      ["Average time to mine block", 14.8],
    ]);
    avgTime += delta;
    prevTime = new Date().getTime();
    i++;
  }
}, 1000);
