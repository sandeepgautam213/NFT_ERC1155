// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";

contract NFT is ERC1155 , Ownable, ERC1155Burnable, ERC1155Supply {
    uint256 maxSupply ;
    uint256 public mintPrice;

     constructor(string memory _uri, uint256 _maxSupply)
        ERC1155(_uri)
        Ownable(msg.sender)
    {
        maxSupply = _maxSupply;
        mintPrice = 1000000000000000;
    }
     function setMintPrice(uint256 _id) private {
        uint256 amount = totalSupply(_id);
        if(amount==0){
            mintPrice = 1000000000000000;
            
        } else 
        mintPrice = (1000000000000000 * amount * amount) / 8000;
    }
      function setURI(string memory uri) public onlyOwner {
        _setURI(uri);
    }
    function mint(uint256 id, uint256 _amount) public payable {
        require(msg.value == mintPrice * _amount, "Print correct amount");
        require(
            totalSupply(id) + _amount <= maxSupply,
            "you have exceed total supply"
        );
        _mint(msg.sender, id, _amount, "");
        setMintPrice(id);
    }

    function burn(uint256 id, uint256 value) public {
        burn(msg.sender, id, value);
        setMintPrice(id);
        payable(msg.sender).transfer(mintPrice);
    }

    function _update(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory values
    ) internal override(ERC1155, ERC1155Supply) {
        super._update(from, to, ids, values);
    }
}








