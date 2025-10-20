// chatGPT was used to code solutions presented in this assignment
import { messages } from "../lang/messages/en/user.js";

const SERVER_URL = "https://comp4537-lab6-yigm.onrender.com";
const insertPath = "/COMP4537/labs/5/api/v1/insert";
const queryPath = "/COMP4537/labs/5/api/v1/query";

function createEl(tag, parent, props = {}) {
  const element = document.createElement(tag);
  Object.assign(element, props); // copies all object properties from props to element
  parent.appendChild(element);
  return element;
}

const app = document.getElementById("app");

createEl("h1", app, { innerText: messages.TITLE });

const insertBtn = createEl("button", app, {
  innerText: messages.SAMPLE_DATA_BUTTON,
});
const insertRes = createEl("p", app, { innerText: "" });

createEl("h3", app, { innerText: messages.SQL_TEXTAREA_HEADER });
const sqlBox = createEl("textarea", app, {
  rows: 4,
  cols: 80,
  placeholder: messages.SQL_TEXTAREA_INNER,
});
createEl("br", app);
const submitBtn = createEl("button", app, { innerText: messages.SQL_BUTTON });

const queryRes = createEl("pre", app, { innerText: "" });

insertBtn.onclick = async () => {
  try {
    const res = await fetch(`${SERVER_URL}${insertPath}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "insertSample" }),
    });
    insertRes.innerText = await res.text();
  } catch (err) {
    insertRes.innerText = messages.SQL_ERROR;
  }
};

submitBtn.onclick = async () => {
  const query = sqlBox.value.trim();
  if (!query) return alert(messages.SQL_EMPTY);

  const lower = query.toLowerCase();
  let res;

  try {
    if (lower.startsWith("select")) {
      res = await fetch(
        `${SERVER_URL}${queryPath}?sql=` + encodeURIComponent(query)
      );
    } else if (lower.startsWith("insert")) {
      res = await fetch(`${SERVER_URL}${queryPath}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sql: query }),
      });
    } else {
      return alert(messages.SQL_BAD_COMMAND);
    }

    queryRes.innerText = await res.text();
  } catch (err) {
    queryRes.innerText = messages.SQL_CONNECTION_ERROR;
  }
};
