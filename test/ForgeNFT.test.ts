import { expect } from "chai";
import { ethers } from "hardhat";

describe("ForgeNFT", function () {
  async function deployForgeNFTFixture() {
    const [owner, otherAccount] = await ethers.getSigners();
    const ForgeNFT = await ethers.getContractFactory("ForgeNFT");
    const forgeNFT = await ForgeNFT.deploy();
    return { forgeNFT, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set the right name and symbol", async function () {
      const { forgeNFT } = await deployForgeNFTFixture();
      expect(await forgeNFT.name()).to.equal("ForgeNFT");
      expect(await forgeNFT.symbol()).to.equal("FNFT");
    });

    it("Should set the right owner", async function () {
      const { forgeNFT, owner } = await deployForgeNFTFixture();
      expect(await forgeNFT.owner()).to.equal(owner.address);
    });
  });

  describe("Minting", function () {
    it("Should mint a new NFT with correct URI", async function () {
      const { forgeNFT, owner } = await deployForgeNFTFixture();
      const tokenURI = "ipfs://QmTest123";

      const tx = await forgeNFT.mint(tokenURI);
      const receipt = await tx.wait();

      const tokenId = 1;
      expect(await forgeNFT.ownerOf(tokenId)).to.equal(owner.address);
      expect(await forgeNFT.tokenURI(tokenId)).to.equal(tokenURI);
    });

    it("Should increment token IDs correctly", async function () {
      const { forgeNFT } = await deployForgeNFTFixture();

      await forgeNFT.mint("ipfs://QmTest1");
      await forgeNFT.mint("ipfs://QmTest2");

      expect(await forgeNFT.totalSupply()).to.equal(2);
    });

    it("Should allow any address to mint", async function () {
      const { forgeNFT, otherAccount } = await deployForgeNFTFixture();
      const tokenURI = "ipfs://QmTest123";

      await forgeNFT.connect(otherAccount).mint(tokenURI);

      const tokenId = 1;
      expect(await forgeNFT.ownerOf(tokenId)).to.equal(otherAccount.address);
    });
  });
});