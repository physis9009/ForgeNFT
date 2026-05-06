// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ForgeNFT is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId = 1;

    constructor() ERC721("ForgeNFT", "FNFT") Ownable(msg.sender) {}

    function mint(string memory uri) public returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, uri);
        return tokenId;
    }

    function totalSupply() public view returns (uint256) {
        return _nextTokenId - 1;
    }
}