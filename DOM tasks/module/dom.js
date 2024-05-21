class MovieCollectionWithDom extends MovieCollection {
    constructor() {
        super();
    }

    auctionTableToHTML() {
        let rows = "";
        for (let item of this.items) {
            rows += this.itemToHTML(item);
        }
        return `
            <table>
                <tr>
                    <th>Id</th>
                    <th>Title</th>
                    <th>Director</th>
                    <th>Trailer Url</th>
                    <th>Release Year</th>
                    <th>Box Office</th>
                    <th colspan="2">Actions</th>
                </tr>
                ${rows}
            </table>
            <button type="button" onclick="ShowAddItem()">Add item</button>
        `;
    }

    itemToHTML(item) {
        return `
            <tr>
                <td>${item._id}</td>
                <td>${item.title}</td>
                <td>${item.director}</td>
                <td>${item.trailerUrl}</td>
                <td>${item.releaseYear}</td>
                <td>${item.boxOffice}</td>
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
                    <input name="title" placeholder="item title">
                    <input name="director" placeholder="director">
                    <input name="trailerUrl" placeholder="trailerUrl">
                    <input name="releaseYear" placeholder="releaseYear">
                    <input name="boxOffice" type="number" placeholder="boxOffice">
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

    toHTML() {
        return this.auctionTableToHTML() + this.addFormToHTML() + this.editFormToHTML();
    }

    mount(parent) {
        this._parent = parent;
        this.render();
        this.addEventListeners();
    }

    render() {
        this._parent.innerHTML = this.toHTML();
    }

    addEventListeners() {
        document.addEventListener("deleteItem", event => {
            super.remove(event.detail.id);
            this.render();
        });

        document.addEventListener("addItem", event => {
            super.addMovie(
                new Movie(
                    event.detail.title,
                    event.detail.director,
                    event.detail.trailerUrl,
                    event.detail.releaseYear,
                    event.detail.boxOffice
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
    }
}

function DeleteItem(id) {
    let deleteItemEvent = new CustomEvent("deleteItem", { detail: { id } });
    document.dispatchEvent(deleteItemEvent);
}



function AddNewItem() {
    const title = document.getElementsByName("title")[0].value;
    const director = document.getElementsByName("director")[0].value;
    const trailerUrl = document.getElementsByName("trailerUrl")[0].value;
    const releaseYear = document.getElementsByName("releaseYear")[0].value;
    const boxOffice = document.getElementsByName("boxOffice")[0].value;
    let addItemEvent = new CustomEvent("addItem", {
        detail: {
            title,
            director,
            trailerUrl,
            releaseYear,
            boxOffice
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

function ShowAddItem() {
    document.getElementById("add").style.display = "block";
}