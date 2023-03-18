let finishedBooks = [];
let unFinishedBooks = [];

const elementJudulBuku = document.getElementById("judulBuku");
const elementPenulisBuku = document.getElementById("penulisBuku");
const elementTanda = document.getElementById("tanda");
const elementButtonSubmit = document.getElementById("submit");

const elementTextSearch = document.getElementById("search");
const elementButtonSearch = document.getElementById("btnSearch");

const elementFinishedBook = document.getElementById("finisedBooks");
const elementUnFinishedBook = document.getElementById("unFinisedBooks");

const warningJudulBuku = document.getElementById("warn-judulBuku");
const warningPenulisBuku = document.getElementById("warn-penulisBuku");

// Event body on loaded (reload)
document.addEventListener("DOMContentLoaded", () => {
  finishedBooks = JSON.parse(localStorage.getItem("finishedBooks")) || [];
  unFinishedBooks = JSON.parse(localStorage.getItem("unFinishedBooks")) || [];

  setDisplay();
});

// Event button submit isi data
elementButtonSubmit.addEventListener("click", function () {
  const id = Date.now();
  const judulBuku = elementJudulBuku.value.trim();
  const penulisBuku = elementPenulisBuku.value.trim();
  const tandaSelesai = elementTanda.checked;
  let isValid = false;

  if (penulisBuku && judulBuku) isValid = true;

  if (!judulBuku) {
    warningJudulBuku.style.display = "inline-block";
  } else {
    warningJudulBuku.style.display = "none";
  }

  if (!penulisBuku) {
    warningPenulisBuku.style.display = "inline-block";
  } else {
    warningPenulisBuku.style.display = "none";
  }

  const data = {
    id,
    judulBuku,
    penulisBuku,
    tandaSelesai,
  };

  if (isValid) {
    if (tandaSelesai) {
      finishedBooks.push(data);

      localStorage.setItem("finishedBooks", JSON.stringify(finishedBooks));
    } else {
      unFinishedBooks.push(data);

      localStorage.setItem("unFinishedBooks", JSON.stringify(unFinishedBooks));
    }

    setDisplay();
    resetInput();
  }
});

// Event on search
elementButtonSearch.addEventListener("click", () => {
  finishedBooks = JSON.parse(localStorage.getItem("finishedBooks")) || [];
  unFinishedBooks = JSON.parse(localStorage.getItem("unFinishedBooks")) || [];

  const searchValue = elementTextSearch.value.trim();
  const regex = new RegExp(searchValue, "gi");
  // console.log(searchValue.replace(regex, ""));

  if (searchValue) {
    finishedBooks = finishedBooks.filter(
      (book) => book.judulBuku.match(regex) || book.penulisBuku.match(regex)
    );
    unFinishedBooks = unFinishedBooks.filter(
      (book) => book.judulBuku.match(regex) || book.penulisBuku.match(regex)
    );
  }

  setDisplay();
});

const setDisplay = () => {
  let finishedContent = "";
  let unFinishedContent = "";

  finishedBooks.forEach((book) => {
    finishedContent += setBookContent(book);
  });

  unFinishedBooks.forEach((book) => {
    unFinishedContent += setBookContent(book);
  });

  elementFinishedBook.innerHTML = finishedContent
    ? finishedContent
    : "<h3 style='text-align: center'>No Data</h3>";
  elementUnFinishedBook.innerHTML = unFinishedContent
    ? unFinishedContent
    : "<h3 style='text-align: center'>No Data</h3>";

  setActionButtonEvent();
  setDeleteButtonEvent();
};

const setBookContent = (book) => {
  return `<div class="card">
  <div>
    <h3>${book.judulBuku}</h3>
    <p>Penulis : ${book.penulisBuku}</p>
  </div>
  <div>
    <button class="btn action" value='${JSON.stringify(book)}'>${
    book.tandaSelesai ? "Set Unfinish" : "Set Finish"
  }</button>
    <button class="btn delete" value='${JSON.stringify(book)}'>Hapus</button>
  </div>
</div>`;
};

const setActionButtonEvent = () => {
  const elementButtonAction = document.querySelectorAll(".action");

  elementButtonAction.forEach((button) =>
    button.addEventListener("click", () => onClickAction(button))
  );
};

const setDeleteButtonEvent = () => {
  const elementButtonDelete = document.querySelectorAll(".delete");

  elementButtonDelete.forEach((button) =>
    button.addEventListener("click", () => onDeleteAction(button))
  );
};

const onClickAction = (button) => {
  const buttonValue = JSON.parse(button.value);

  if (buttonValue.tandaSelesai) {
    finishedBooks = finishedBooks.filter((book) => buttonValue.id !== book.id);

    unFinishedBooks.push({
      ...buttonValue,
      tandaSelesai: false,
    });
  } else {
    unFinishedBooks = unFinishedBooks.filter(
      (book) => buttonValue.id !== book.id
    );

    finishedBooks.push({
      ...buttonValue,
      tandaSelesai: true,
    });
  }

  // const string = "ABCDE";
  // function apayak(...param) {
  //   console.log(param);
  // }

  // console.log({ ...string, 0: "F" });
  // apayak("hello", "helolagi", "heloaja");
  // apayak("hello", "helolagi");

  localStorage.setItem("finishedBooks", JSON.stringify(finishedBooks));
  localStorage.setItem("unFinishedBooks", JSON.stringify(unFinishedBooks));

  setDisplay();
};

const onDeleteAction = (button) => {
  const buttonValue = JSON.parse(button.value);

  if (buttonValue.tandaSelesai) {
    finishedBooks = finishedBooks.filter((book) => buttonValue.id !== book.id);
  } else {
    unFinishedBooks = unFinishedBooks.filter(
      (book) => buttonValue.id !== book.id
    );
  }

  localStorage.setItem("finishedBooks", JSON.stringify(finishedBooks));
  localStorage.setItem("unFinishedBooks", JSON.stringify(unFinishedBooks));

  setDisplay();
};

const resetInput = () => {
  elementJudulBuku.value = "";
  elementPenulisBuku.value = "";
  elementTanda.checked = false;
};
