const theme = document.getElementById("theme");
let basicArray = [
  { category: "active", task: "Complete online JavaScript course" },
  { category: "active", task: "Jog around the park 3x" },
  { category: "completed", task: "10 minutes meditation" },
  { category: "completed", task: "Read for 1 hour" },
  { category: "active", task: "Pick up groceries" },
  { category: "active", task: "Complete Todo App on Frontend Mentor" },
];

let todoArray = [];

if (localStorage.todo) {
  todoArray = JSON.parse(localStorage.todo);
} else {
  todoArray = basicArray;
}

// ************** DARK MODE MANAGEMENT **************

if (localStorage.themeIsDark === true) {
  document.body.classList.add("dark");
  theme.src = "./images/icon-sun.svg";
  theme.alt = "Sun icon";
}

theme.addEventListener("click", () => {
  if (document.body.classList.contains("dark")) {
    document.body.classList.remove("dark");
    theme.src = "./images/icon-moon.svg";
    theme.alt = "Moon icon";
    localStorage.themeIsDark = false;
  } else {
    document.body.classList.add("dark");
    theme.src = "./images/icon-sun.svg";
    theme.alt = "Sun icon";
    localStorage.themeIsDark = true;
  }
});

const utils = {
  dragAndDrop: function () {
    let item, target;
    document.addEventListener("dragstart", (e) => {
      item = e.target;
    });

    document.addEventListener("dragover", (e) => {
      e.preventDefault();
    });

    document.addEventListener("drop", (e) => {
      if (e.target.draggable) {
        target = e.target;
      } else {
        target = e.target.parentNode;
      }

      const targetPosition = parseInt(target.dataset.pos);
      const movedPosition = parseInt(item.dataset.pos);
      [todoArray[targetPosition], todoArray[movedPosition]] = [
        todoArray[movedPosition],
        todoArray[targetPosition],
      ];
      page.all();
    });

    document.addEventListener("dragend", () => (item = null));
  },

  pageContent: function (content) {
    document.querySelector("section div ul").innerHTML = content;
  },

  mapArray: function (array, vueIsNotCompletedVue) {
    let position = 0;
    let mapArray = array
      .map((todo) => {
        todo.position = position;
        let classe = "check";
        if (vueIsNotCompletedVue && todo.category === "completed") {
          classe += " checked";
        }
        return `
						<li draggable="true" data-pos=${position}>
							<div class="${classe}" data-pos='${position}'>
                <img src="./images/icon-check.svg" alt="Icon check" />
              </div>
							<span>${todo.task}</span>
							<img src="./images/icon-cross.svg" alt="Cross icon" class="cross" data-pos='${position++}' />
						</li>
					`;
      })
      .join("");
    return mapArray;
  },

  displayCategories: function () {
    document.querySelectorAll(".links span").forEach((link) => {
      link.addEventListener("click", (e) => {
        this.removeActiveClassFromLink();
        link.classList.add("active");
        switch (e.target.id) {
          case "all":
            page.all();
            break;
          case "active":
            page.active();
            break;
          case "completed":
            page.completed();
            break;
          default:
            null;
            break;
        }
      });
    });
  },

  removeActiveClassFromLink: function () {
    const links = document.querySelectorAll(".links span");
    links.forEach((link) => (link.classList = ""));
  },

  handleEventClearCompleted: function () {
    const clearCompleted = document.getElementById("clear");

    clearCompleted.addEventListener("click", () => {
      todoArray = todoArray.filter((todo) => todo.category !== "completed");
      page.all();
    });
  },

  createNewTodo: function () {
    const submit = document.getElementById("submit");

    submit.addEventListener("click", () => {
      if (document.getElementById("createNewTodo").value.length > 0) {
        const newTodo = {
          category: "active",
          task: document.getElementById("createNewTodo").value,
        };
        document.getElementById("createNewTodo").value = "";
        todoArray.unshift(newTodo);
        page.all();
      }
    });
  },

  makeItemCompleted: function () {
    const checks = document.querySelectorAll(".check");
    checks.forEach((check) => {
      check.addEventListener("click", (e) => {
        todoArray.map((todo) => {
          if (todo.position == e.target.dataset.pos) {
            todo.category =
              todo.category === "completed" ? "active" : "completed";

            check.classList.contains("checked")
              ? check.classList.remove("checked")
              : check.classList.add("checked");

            check.innerHTML = `<img src="./images/icon-check.svg" alt="Icon check" />`;
          }
        });
        page.all();
      });
    });
  },

  deleteTodo: function () {
    const crosses = document.querySelectorAll(".cross");
    crosses.forEach((cross) => {
      cross.addEventListener("click", (e) => {
        let newArray = [];
        todoArray.map((todo) => {
          if (todo.position != e.target.dataset.pos) {
            newArray.push(todo);
          }
        });
        todoArray = newArray;
        page.all();
      });
    });
  },

  store: function () {
    localStorage.todo = JSON.stringify(todoArray);
  },
};

const page = {
  all: function () {
    let mapArray = utils.mapArray(todoArray, true);
    const itemLeftCounter = todoArray.filter(
      (todo) => todo.category === "active"
    ).length;

    document.getElementById("itemLeftDisplay").textContent = itemLeftCounter;

    utils.pageContent(mapArray);
    utils.displayCategories();
    utils.handleEventClearCompleted();
    utils.deleteTodo();
    utils.createNewTodo();
    utils.makeItemCompleted();
    utils.store();
    utils.dragAndDrop();
  },

  active: function () {
    let mapArray = todoArray.filter((todo) => todo.category === "active");

    mapArray = utils.mapArray(mapArray);
    utils.pageContent(mapArray);
  },

  completed: function () {
    let mapArray = todoArray.filter((todo) => todo.category === "completed");

    mapArray = utils.mapArray(mapArray);
    utils.pageContent(mapArray);
  },
};

page.all();
