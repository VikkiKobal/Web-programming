class AuctionItems {
    constructor(name, startDate, endDate, startPrice, endPrice) {
        this._id = Math.floor(Math.random() * 100);
        this.name = name;
        this.startDate = startDate;
        this.endDate = endDate;
        this.startPrice = startPrice;
        this.endPrice = endPrice;
    }

    get id() {
        return this._id;
    }

    toString() {
        return `Name: ${this.name}, id: ${this.id}, start price: ${this.startPrice}, end price: ${this.endPrice}`;
    }
}

class Auction {
    constructor() {
        this.items = [];
    }

    add(item) {
        this.items.push(item);
    }

    remove(id) {
        this.items = this.items.filter(item => item.id !== id);
    }

    update(id, updatedItem) {
        let itemIndex = this.items.findIndex(item => item.id === id);
        if (itemIndex !== -1) {
            this.items[itemIndex] = updatedItem;
        } else {
            throw new Error("Item not found");
        }
    }

    getById(id) {
        return this.items.find(item => item.id === id);
    }
    
    getByDateAndPrice(date, maxPrice) {
        return this.items.filter(item => item.startDate == date && item.startPrice <= maxPrice);
    }
}
