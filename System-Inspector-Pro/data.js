const starterFiles = [
  {
    id: "file-1",
    name: "index.html",
    content: "<main>System Inspector Pro dashboard shell</main>"
  },
  {
    id: "file-2",
    name: "style.css",
    content: ".glass-panel { backdrop-filter: blur(20px); }"
  },
  {
    id: "file-3",
    name: "script.js",
    content: "renderSystemCards(); renderEnvironmentTable();"
  },
  {
    id: "file-4",
    name: "data.js",
    content: "const systemInfo = []; const environmentVariables = [];"
  },
  {
    id: "file-5",
    name: "README.md",
    content: "# System Inspector Pro"
  }
];

const documentationItems = [
  {
    title: "System Information",
    body: "The tool collects important machine details such as OS, memory, processor, runtime, and hostname so developers can understand the environment they are working in."
  },
  {
    title: "CPU Architecture",
    body: "x64 means a 64-bit Intel or AMD style processor. ARM is another processor family commonly used in phones, tablets, and newer laptops."
  },
  {
    title: "Hostname",
    body: "A hostname is the computer identity used on local networks and inside developer logs. It helps teams know which machine produced a result."
  },
  {
    title: "Environment Variables",
    body: "Environment variables are named configuration values. Developers use them for paths, usernames, temporary folders, tokens, modes, and machine-specific settings."
  },
  {
    title: "CRUD",
    body: "CRUD means Create, Read, Update, and Delete. In this frontend project it simulates file operations through cards saved in browser LocalStorage."
  },
  {
    title: "Create",
    body: "Creating new files means entering a filename and content, then saving that object into LocalStorage."
  },
  {
    title: "Read",
    body: "Reading files means showing every saved file as a visible card with its filename and content preview."
  },
  {
    title: "Update",
    body: "Updating files means loading an existing file into the form, changing its content, and replacing the saved LocalStorage record."
  },
  {
    title: "Delete",
    body: "Deleting files removes the selected card from the saved LocalStorage array."
  }
];
