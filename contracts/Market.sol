// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.3;

import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/interfaces/IERC2981Upgradeable.sol";
import "hardhat/console.sol";

contract NFTMarket is Initializable, ReentrancyGuardUpgradeable, UUPSUpgradeable, OwnableUpgradeable {
  using CountersUpgradeable for CountersUpgradeable.Counter;
  CountersUpgradeable.Counter private _itemIds;
  CountersUpgradeable.Counter private _itemsSold;

  uint256 listingPrice;
  string public version;

  bytes4 private constant _INTERFACE_ID_ERC2981 = 0x2a55205a;

  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() initializer {}

  function initialize() public initializer {
    __Ownable_init();
    __UUPSUpgradeable_init();
    listingPrice = 0.005 ether;
  }

	function _authorizeUpgrade(address) internal override onlyOwner {
		version = "2.0"; // this will actually be called when upgrading the contract.
	}

  /// @notice Transfers royalties to the rightsowner if applicable
  /// @param tokenId - the NFT assed queried for royalties
  /// @param grossSaleValue - the price at which the asset will be sold
  /// @return netSaleAmount - the value that will go to the seller after
  ///         deducting royalties
  function _deduceRoyalties(address nftContract, uint256 tokenId, uint256 grossSaleValue)
  internal returns (uint256 netSaleAmount) {
      // Get amount of royalties to pays and recipient
      (address royaltiesReceiver, uint256 royaltiesAmount) = IERC2981Upgradeable(nftContract).royaltyInfo(tokenId, grossSaleValue);
      // Deduce royalties from sale value
      uint256 netSaleValue = grossSaleValue - royaltiesAmount;
      // Transfer royalties to rightholder if not zero
      if (royaltiesAmount > 0) {
          royaltiesReceiver.call{value: royaltiesAmount}('');
      }
      // Broadcast royalties payment
      emit RoyaltiesPaid(tokenId, royaltiesAmount);
      return netSaleValue;
  }

  /// @notice Checks if NFT contract implements the ERC-2981 interface
  /// @param _contract - the address of the NFT contract to query
  /// @return true if ERC-2981 interface is supported, false otherwise
  function _checkRoyalties(address _contract) internal returns (bool) {
      (bool success) = IERC2981Upgradeable(_contract).
      supportsInterface(_INTERFACE_ID_ERC2981);
      return success;
  }

  struct MarketItem {
    uint itemId;
    address nftContract;
    uint256 tokenId;
    address payable seller;
    address payable owner;
    uint256 price;
    bool sold;
  }

  mapping(uint256 => MarketItem) private idToMarketItem;

  event MarketItemCreated (
    uint indexed itemId,
    address indexed nftContract,
    uint256 indexed tokenId,
    address seller,
    address owner,
    uint256 price,
    bool sold
  );

  event MarketItemSold (
    uint indexed itemId,
    address indexed nftContract,
    uint256 indexed tokenId,
    address seller,
    address owner,
    uint256 price,
    bool sold
  );

  // Emitted when the stored value changes
  event ValueChanged(uint256 value);

  event RoyaltiesPaid(uint256 tokenId, uint value);

  // Increments the stored value by 1
  function incrementListingPrice() public {
      listingPrice = listingPrice + 1;
      emit ValueChanged(listingPrice);
  }

  /* Returns the listing price of the contract */
  function getListingPrice() public view returns (uint256) {
    return listingPrice;
  }

  /* Places an item for sale on the marketplace */
  function createMarketItem(
    address nftContract,
    uint256 tokenId,
    uint256 price
  ) public payable nonReentrant {
    require(price > 0, "Price must be at least 1 wei");
    require(msg.value == listingPrice, "Price must be equal to listing price");

    _itemIds.increment();
    uint256 itemId = _itemIds.current();

    idToMarketItem[itemId] =  MarketItem(
      itemId,
      nftContract,
      tokenId,
      payable(msg.sender),
      payable(address(0)),
      price,
      false
    );

    IERC721Upgradeable(nftContract).transferFrom(msg.sender, address(this), tokenId);

    emit MarketItemCreated(
      itemId,
      nftContract,
      tokenId,
      msg.sender,
      address(0),
      price,
      false
    );
  }

  /* Creates the sale of a marketplace item */
  /* Transfers ownership of the item, as well as funds between parties */
  function createMarketSale(
    address nftContract,
    uint256 itemId
    ) public payable nonReentrant {
    uint price = idToMarketItem[itemId].price;
    uint tokenId = idToMarketItem[itemId].tokenId;

    uint256 saleValue = msg.value;
    // Pay royalties if applicable
    if (_checkRoyalties(nftContract)) {
        saleValue = _deduceRoyalties(nftContract, tokenId, saleValue);
    }
    // Transfer funds to the seller
    idToMarketItem[itemId].seller.call{value: saleValue}('');
    IERC721Upgradeable(nftContract).transferFrom(address(this), msg.sender, tokenId);
    idToMarketItem[itemId].owner = payable(msg.sender);
    idToMarketItem[itemId].sold = true;
    _itemsSold.increment();
    uint unsoldItemCount = _itemIds.current() - _itemsSold.current();

    emit MarketItemSold(
      itemId,
      nftContract,
      tokenId,
      address(0),
      msg.sender,
      price,
      true
    );
  }

  /* Returns all unsold market items */
  function fetchMarketItems() public view returns (MarketItem[] memory) {
    uint itemCount = _itemIds.current();
    uint unsoldItemCount = _itemIds.current() - _itemsSold.current();
    uint currentIndex = 0;

    MarketItem[] memory items = new MarketItem[](unsoldItemCount);
    for (uint i = 0; i < itemCount; i++) {
      if (idToMarketItem[i + 1].owner == address(0)) {
        uint currentId = i + 1;
        MarketItem storage currentItem = idToMarketItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }

  /* Returns onlyl items that a user has purchased */
  function fetchMyNFTs() public view returns (MarketItem[] memory) {
    uint totalItemCount = _itemIds.current();
    uint itemCount = 0;
    uint currentIndex = 0;

    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].owner == msg.sender) {
        itemCount += 1;
      }
    }

    MarketItem[] memory items = new MarketItem[](itemCount);
    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].owner == msg.sender) {
        uint currentId = i + 1;
        MarketItem storage currentItem = idToMarketItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }

  /* Returns only items a user has created */
  function fetchItemsCreated() public view returns (MarketItem[] memory) {
    uint totalItemCount = _itemIds.current();
    uint itemCount = 0;
    uint currentIndex = 0;

    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].seller == msg.sender) {
        itemCount += 1;
      }
    }

    MarketItem[] memory items = new MarketItem[](itemCount);
    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].seller == msg.sender) {
        uint currentId = i + 1;
        MarketItem storage currentItem = idToMarketItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }
}
