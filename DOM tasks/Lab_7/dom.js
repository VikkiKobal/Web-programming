class AuctionWithDom extends Auction {
    constructor() {
        super();
    }

    auctionTableToHTML(items = this.items) {
        let rows = "";
        for (let item of items) {
            rows += this.itemToHTML(item);
        }
        return `
            <table>
                <tr>
                    <th>Id</th>
                    <th>Name</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Start Price</th>
                    <th>End Price</th>
                    <th colspan="2">Actions</th>
                </tr>
                ${rows}
            </table>
        `;
    }

    itemToHTML(item) {
        return `
            <tr>
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${item.startDate}</td>
                <td>${item.endDate}</td>
                <td>${item.startPrice}</td>
                <td>${item.endPrice}</td>
                <td>
                    <button onclick="DeleteItem(${item.id})">Delete</button>
                </td>
                <td>
                    <button onclick="StartEditItem(${item.id})">Edit</button>
                </td>
            </tr>
        `;
    }

    addFormToHTML() {
        return `
            <div id="add" style="display: none;">
                <form name="addForm" method="post" action="#">
                    <h3>Add Item</h3>
                    <input name="name" placeholder="item name">
                    <input name="startDate" type="date" placeholder="start date">
                    <input name="endDate" type="date" placeholder="end date">
                    <input name="startPrice" placeholder="start price">
                    <input name="endPrice" placeholder="end price">
                    <button type="button" onclick="AddNewItem()">Save</button>
                </form>
            </div>
        `;
    }

    editFormToHTML() {
        return `
            <div id="edit" style="display: none;">
                <form name="editForm" method="post" action="#">
                    <h3>Edit Item</h3>
                    <input name="id" type="hidden">
                    <input name="name" placeholder="item name">
                    <input name="startDate" type="date" placeholder="start date">
                    <input name="endDate" type="date" placeholder="end date">
                    <input name="startPrice" placeholder="start price">
                    <input name="endPrice" placeholder="end price">
                    <button type="button" onclick="EditItem()">Save</button>
                </form>
            </div>
        `;
    }

    searchFormToHTML() {
        return `
            <div id="search">
                <form name="searchForm" method="post" action="#">
                    <h2>Search Items</h2>
                    <input name="date" type="date" placeholder="date">
                    <input name="maxPrice" placeholder="max price">
                    <button type="button" onclick="SearchItems()">Search</button>
                </form>
            </div>
        `;
    }

    toHTML() {
        return this.searchFormToHTML() + this.auctionTableToHTML() + this.addFormToHTML() + this.editFormToHTML() + `<button type="button" onclick="ShowAddItem()">Add item</button>`;
    }

    mount(parent) {
        this._parent = parent;
        this.render();
        this.addEventListeners();
    }

    render(items) {
        if (items) {
            this._parent.querySelector('table').outerHTML = this.auctionTableToHTML(items);
        } else {
            this._parent.innerHTML = this.toHTML();
        }
    }

    addEventListeners() {
        document.addEventListener("deleteItem", event => {
            super.remove(event.detail.id);
            this.render();
        });

        document.addEventListener("addItem", event => {
            super.add(
                new AuctionItems(
                    event.detail.name,
                    event.detail.startDate,
                    event.detail.endDate,
                    event.detail.startPrice,
                    event.detail.endPrice
                )
            );
            this.render();
        });

        document.addEventListener("editItem", event => {
            try {
                super.update(event.detail.id, event.detail);
                this.render();
            } catch (error) {
                console.log(error);
                alert(error);
            }
        });

        document.addEventListener("searchItems", event => {
            const items = super.getByDateAndPrice(event.detail.date, event.detail.maxPrice);
            this.render(items);
        });
    }
}

function DeleteItem(id) {
    let deleteItemEvent = new CustomEvent("deleteItem", { detail: { id } });
    document.dispatchEvent(deleteItemEvent);
}

function AddNewItem() {
    const name = document.getElementsByName("name")[0].value;
    const startDate = document.getElementsByName("startDate")[0].value;
    const endDate = document.getElementsByName("endDate")[0].value;
    const startPrice = document.getElementsByName("startPrice")[0].value;
    const endPrice = document.getElementsByName("endPrice")[0].value;
    let addItemEvent = new CustomEvent("addItem", {
        detail: {
            name,
            startDate,
            endDate,
            startPrice,
            endPrice
        }
    });
    document.dispatchEvent(addItemEvent);
}

function StartEditItem(id) {
    document.getElementById("edit").style.display = "block";
    try {
      let item = auction.getById(id);
      const editForm = document.forms.editForm;
      editForm.elements.id.value = item.id;
      editForm.elements.name.value = item.name;
      editForm.elements.startDate.value = item.startDate;
      editForm.elements.endDate.value = item.endDate;
      editForm.elements.startPrice.value = item.startPrice;
      editForm.elements.endPrice.value = item.endPrice;
    } catch (error) {
      console.log(error);
      alert(error);
    }
}

function EditItem() {
    const editForm = document.forms.editForm;
    const id = parseInt(editForm.elements.id.value);
    const name = editForm.elements.name.value;
    const startDate = editForm.elements.startDate.value;
    const endDate = editForm.elements.endDate.value;
    const startPrice = editForm.elements.startPrice.value;
    const endPrice = editForm.elements.endPrice.value;

    let item = auction.getById(id);
    item.name = name;
    item.startDate = startDate;
    item.endDate = endDate;
    item.startPrice = startPrice;
    item.endPrice = endPrice;

    let editItemEvent = new CustomEvent("editItem", {
      detail: {
        id,
        name,
        startDate,
        endDate,
        startPrice,
        endPrice
      }
    });
    document.dispatchEvent(editItemEvent);
}

function SearchItems() {
    const date = document.getElementsByName("date")[0].value;
    const maxPrice = document.getElementsByName("maxPrice")[0].value;
    let searchItemsEvent = new CustomEvent("searchItems", {
        detail: {
            date,
            maxPrice: parseFloat(maxPrice)
        }
    });
    document.dispatchEvent(searchItemsEvent);
}

function ShowAddItem() {
    document.getElementById("add").style.display = "block";
}
