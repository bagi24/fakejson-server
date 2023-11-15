const input = document.querySelector(".input");
const lists = document.querySelector(".lists");
const button = document.querySelector(".button");
const addedList = document.querySelector(".addedList");

console.log("click");

let data = [];
let textValue = null;

let editProcess = false;
let editID = null;

console.log(editID);

async function getData() {
  try {
    const response = await fetch("http://localhost:3000/users");
    const result = await response.json();

    data = result;
    addedList.textContent = data.length;
    lists.innerHTML = "";

    data.forEach((value) => {
      const li = document.createElement("li");
      li.textContent = value.name;

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.setAttribute("id", value.id);
      deleteButton.addEventListener("click", (id) => {
        const deleteBtn = data.find((data) => data.id == id.target.id);
        deleteItem(deleteBtn);
      });

      const EditButton = document.createElement("button");
      EditButton.textContent = "Edit";
      EditButton.setAttribute("id", value.id);
      EditButton.addEventListener("click", (id) => {
        const editBtn = data.find((data) => data.id == id.target.id);
        editItem(editBtn);
        editID = id.target.id;
        console.log(editID);
      });

      li.appendChild(deleteButton);
      li.appendChild(EditButton);
      lists.appendChild(li);
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function deleteItem(data) {
  try {
    const response = await fetch(`http://localhost:3000/users/${data.id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      const result = await response.json();
      // console.log("Deleted:", result);

      getData();
    } else {
      console.error("Failed to delete item. Server returned:", response.status);
    }
  } catch (error) {
    console.error("Error deleting item:", error);
  }
}

getData();

async function editItem(data) {
  input.value = data.name;
  button.textContent = "Update";
  editProcess = true;
}

const handleInput = (e) => {
  const currentValue = e.target.value;
  textValue = currentValue;
};

input.addEventListener("change", handleInput);

async function handleClick(e) {
  e.preventDefault();

  if (editProcess) {
    console.log("edit");

    try {
      const response = await fetch(`http://localhost:3000/users/${editID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: textValue }),
      });

      const result = await response.json();

      lists.innerHTML = "";

      input.value = " ";

      button.textContent = "Enter";
      editProcess = false;
      getData();

      console.log("Success:", result);
    } catch (error) {
      console.error("Error:", error);
    }
  } else {
    try {
      const response = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: textValue }),
      });

      const result = await response.json();

      lists.innerHTML = "";

      getData();

      input.value = " ";

      console.log("Success:", result);
    } catch (error) {
      console.error("Error:", error);
    }
  }
}

button.addEventListener("click", handleClick);
