const API = "http://localhost:3000";

let contacts = [];
let editStatus = false;

let initialState = {
  name: "",
  surName: "",
  photo: "",
  phone: "",
  email: "",
};
let addContactForm = {
  ...initialState,
};

let editContactForm = {
  ...initialState,
};

let inputs = document.querySelectorAll("input");
let btn = document.querySelector("button");
let contactList = document.querySelector(".contact_list");

inputs.forEach((input) => {
  let field = input.getAttribute("name");
  input.addEventListener("input", (event) => {
    handleChange(field, event.target.value);
  });
});

document.addEventListener("click", (event) => {
  if (event.target.classList.contains("btn-delete")) {
    const id = event.target.getAttribute("id");
    if (confirm("Do you really wanna delete this contact?")) deleteContact(id);
  }

  if (event.target.classList.contains("btn-edit")) {
    const id = event.target.getAttribute("id");
    editStatus = true;
    window.scrollTo(0, 0);
    btn.innerText = "Edit";
    let editedContact = contacts.find((contact) => contact.id == id);
    editContactForm = {
      ...editedContact,
    };
    inputs.forEach((input) => {
      const field = input.getAttribute("name");
      input.value = editContactForm[field];
    });
  }
});

btn.addEventListener("click", (event) => {
  event.preventDefault();
  if (editStatus) {
    editContact(editContactForm, editContactForm.id);
    resetForm();
    btn.innerText = "Add";
  } else {
    if (Object.values(addContactForm).some((value) => !value.trim())) {
      alert("Не все поля заполнены!");
    } else {
      createContact(addContactForm);
      resetForm();
    }
  }
});

async function getContacts() {
  let contactsResponse = await fetch(`${API}/contacts`).then((res) =>
    res.json()
  );
  contacts = contactsResponse;
  render();
}

async function createContact(contact) {
  const createdContactResponse = await fetch(`${API}/contacts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(contact),
  }).then((res) => res.json());
  contacts.push(createdContactResponse);
  render();
}

async function editContact(editedContact, id) {
  const editedContactResponse = await fetch(`${API}/contacts/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(editedContact),
  }).then((res) => res.json());
  contacts = contacts.map((contact) =>
    contact.id == id ? editedContactResponse : contact
  );
  render();
}

async function deleteContact(id) {
  await fetch(`${API}/contacts/${id}`, {
    method: "DELETE",
  });
  contacts = contacts.filter((contact) => contact.id != id);
  render();
}

function render() {
  contactList.innerHTML = "";
  contacts.forEach((contact) => {
    const wrapper = createElement("div");
    const titleWraper = createElement("div");
    const avatar = createElement("img");
    const title = createElement("h5");
    const infoWrapper = createElement("ul");
    const phone = createElement("li");
    const email = createElement("li");
    const btnWrapper = createElement("div");
    const btnDelete = createElement("button");
    const btnEdit = createElement("button");

    wrapper.style.width = "18rem";
    btnEdit.style.marginLeft = "20px";

    titleWraper.innerText = `${contact.name} ${contact.surName}`;
    avatar.setAttribute("src", contact.photo);
    phone.innerText = contact.phone;
    email.innerText = contact.email;
    btnDelete.innerText = "Delete";
    btnEdit.innerText = "Edit";

    wrapper.classList.add("card");
    titleWraper.classList.add("card-body");
    avatar.classList.add("card-img-top");
    title.classList.add("card-title");
    infoWrapper.classList.add("list-group", "list-group-flush");
    phone.classList.add("list-group-item");
    email.classList.add("list-group-item");
    btnWrapper.classList.add("card-body");
    btnDelete.classList.add("btn", "btn-danger", "btn-delete");
    btnEdit.classList.add("btn", "btn-warning", "btn-edit");

    btnDelete.setAttribute("id", contact.id);
    btnEdit.setAttribute("id", contact.id);

    titleWraper.append(title);
    infoWrapper.append(phone, email);
    btnWrapper.append(btnDelete, btnEdit);
    wrapper.append(avatar, titleWraper, infoWrapper, btnWrapper);

    contactList.append(wrapper);
  });
}

function handleChange(field, value) {
  if (editStatus) {
    editContactForm = {
      ...editContactForm,
      [field]: value,
    };
  } else {
    addContactForm = {
      ...addContactForm,
      [field]: value,
    };
  }
}

function resetForm() {
  inputs.forEach((input) => {
    input.value = "";
  });
  if (editStatus) {
    editContactForm = {
      ...initialState,
    };
  } else {
    addContactForm = {
      ...initialState,
    };
  }
}

function createElement(tag) {
  return document.createElement(tag);
}

getContacts();
