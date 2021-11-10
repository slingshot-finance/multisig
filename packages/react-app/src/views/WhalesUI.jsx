import React, { useState } from "react";

import { Button, Input } from "antd";
import { formatEther, parseEther } from "@ethersproject/units";
import { usePoller } from "../hooks";

const WhalesUI = ({ readContracts, address, writeContracts }) => {
  const [q, setQ] = useState("");
  const [floor, setFloor] = useState("0.0");

  usePoller(async () => {
    if (readContracts && address) {
      const floorPrice = await readContracts.RetroactiveFunding.floor(readContracts.MoonshotBot.address);
      setFloor(formatEther(floorPrice));
    }
  }, 1500);

  const increaseFloor = async () => {
    await writeContracts.RetroactiveFunding.increaseFloor(readContracts.MoonshotBot.address, {
      value: parseEther(q),
    });
  };

  return (
    <div style={{ maxWidth: 300, margin: "20px auto" }}>
      <h2 style={{ marginBottom: "20px" }}>Increasing floor</h2>
      <div style={{ display: "flex", alignItems: "center", maxWidth: 300, margin: "0 auto", marginBottom: "10px" }}>
        <label htmlFor="quantity" style={{ marginRight: 20, flexGrow: 1, flex: 1, textAlign: "left" }}>
          Quantity:
        </label>
        <Input
          type="number"
          placeholder="1 ETH"
          id="quantity"
          style={{ flex: 2 }}
          value={q}
          onChange={e => setQ(e.target.value)}
        />
      </div>
      <p style={{ textAlign: "left", marginTop: 15 }}>Current floor price = {floor.substr(0, 6)} ETH</p>
      <Button disabled={q === ""} onClick={increaseFloor}>
        Deposit
      </Button>
    </div>
  );
};

export default WhalesUI;
