const express = require("express");
const path = require("path");

const app = express();

app.set("view engine", "ejs");;
app.use(express.static("views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const users = [{'email' : 'user@uc.com', 'password' : '12345'}];
const display = 5;

let header = ["IDNO", "LASTNAME", "FIRSTNAME", "COURSE", "LEVEL"];

let studentlist = [
  {
    idno: "1000",
    lastname: "durano",
    firstname: "dennis",

    course: "bscpe",
    level: "4",
  },
  {
    idno: "2000",
    lastname: "hello",
    firstname: "world",
    course: "bsit",
    level: "2",
  },
  {
    idno: "3000",
    lastname: "alpha",
    firstname: "bravo",
    course: "bscs",
    level: "3",
  },
  {
    idno: "4000",
    lastname: "sample",
    firstname: "user",
    course: "bsit",
    level: "3",
  },
  {
    idno: "5000",
    lastname: "durano",
    firstname: "dennis",

    course: "bscpe",
    level: "4",
  },
  {
    idno: "6000",
    lastname: "hello",
    firstname: "world",
    course: "bsit",
    level: "2",
  },
  {
    idno: "7000",
    lastname: "alpha",
    firstname: "bravo",
    course: "bscs",
    level: "3",
  },
  {
    idno: "4000",
    lastname: "sample",
    firstname: "user",
    course: "bsit",
    level: "3",
  },
  {
    idno: "5000",
    lastname: "durano",
    firstname: "dennis",

    course: "bscpe",
    level: "4",
  },
  {
    idno: "5235235",
    lastname: "hello",
    firstname: "world",
    course: "bsit",
    level: "2",
  },
  {
    idno: "5325235",
    lastname: "alpha",
    firstname: "bravo",
    course: "bscs",
    level: "3",
  },
  {
    idno: "4000",
    lastname: "sample",
    firstname: "user",
    course: "bsit",
    level: "3",
  },
];

function paginate(array, page_size, page_number) {
  return array.slice((page_number - 1) * page_size, page_number * page_size);
}

function calculateTotalPages(totalItems, itemsPerPage) {
  return Math.ceil(totalItems / itemsPerPage);
}


app.post("/login", (req, res) => {
  let user = req.body.email;
  let pass = req.body.password;
  let choice = false;

  for (var i = 0; i < users.length; i++) {
    if (user == users[i].email && pass == users[i].password) {
      choice = true;
      break;
    }
  }

  if (choice) {
    res.render("index.ejs", {
      header,
      studentlist: paginate(studentlist, display, 1),
    });
  } else {
    res.send(`
      <script>
        alert("Invalid Credentials. Try Again!");
        window.location.href = "/";
      </script>
    `);
  }
});

app.post("/search", (req, res) => {
    const query = req.body.query.trim().toLowerCase();
    const searchResults = studentlist.filter(student => {
        return student.idno.toLowerCase().includes(query) || student.lastname.toLowerCase().includes(query);
    });

    if (searchResults.length > 0) {
        const totalPages = calculateTotalPages(searchResults.length, display);
        const currentPage = 1;
        const paginatedResults = paginate(searchResults, display, currentPage);
        res.render("index.ejs", {
            header,
            studentlist: paginatedResults,
            currentPage,
        });
    } else {
        res.send(`
            <script>
                alert("User does not exist!");
                window.location.href = "/"; 
            </script>
        `);
    }
});

app.get("/deletestudent", (req, res) => {
  let idno = req.query.idno;
  let index = req.query.index;
  console.log("Deleting Student idno :" + idno);
  studentlist.splice(index, 1);
  let currentPage = parseInt(req.query.page) || 1; // Get current page from query parameter or default to 1
  let totalPages = Math.ceil(studentlist.length / display); // Calculate total pages
  currentPage = Math.min(currentPage, totalPages); // Ensure current page is within range
  res.redirect(`/prevPage?page=${currentPage}`); // Redirect to previous page after deletion
});


app.post("/editstudent", (req, res) => {
    let idno = req.body.idno;
    let lastname = req.body.lastname;
    let firstname = req.body.firstname;
    let course = req.body.course;
    let level = req.body.level;
    let index = req.body.index;

    studentlist[index] = {
        idno: idno,
        lastname: lastname,
        firstname: firstname,
        course: course,
        level: level,
    };

    let currentPage = parseInt(req.body.page) || 1; // Get current page from form data or default to 1
    let totalPages = Math.ceil(studentlist.length / display); // Calculate total pages
    currentPage = Math.min(currentPage, totalPages); // Ensure current page is within range
    res.render("index.ejs", {
        header,
        studentlist: paginate(studentlist, display, currentPage),
    });
});

app.post("/save", (req, res) => {
  let idno = req.body.idno;
  let lastname = req.body.lastname;
  let firstname = req.body.firstname;
  let course = req.body.course;
  let level = req.body.level;
  studentlist.push({
    idno: idno,
    lastname: lastname,
    firstname: firstname,
    course: course,
    level: level,
  });
  let totalPages = Math.ceil(studentlist.length / display);
  res.redirect(`/nextPage?page=${totalPages}`); // Redirect to the last page after adding a new student
});


app.get("/nextPage", (req, res) => {
    let currentPage = parseInt(req.query.page) || 1; 
    let totalPages = calculateTotalPages(studentlist.length, display); 
    let nextPage = Math.min(currentPage + 1, totalPages); 
    res.render("index.ejs", {
        header,
        studentlist: paginate(studentlist, display, nextPage),
        currentPage: nextPage, 
    });
});

app.get("/prevPage", (req, res) => {
    let currentPage = parseInt(req.query.page) || 1; 
    let prevPage = Math.max(currentPage - 1, 1); 
    res.render("index.ejs", {
        header,
        studentlist: paginate(studentlist, display, prevPage),
        currentPage: prevPage, 
    });
});

app.get("/logout", (req, res) => {
  res.redirect("/");
});

app.get("/", (req, res) => {
  res.render("login.ejs", {users});
});

app.listen("4321", () => {
  console.log("listening at port 4321");
});