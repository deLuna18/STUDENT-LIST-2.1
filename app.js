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

//LIST OF STUDENTS
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
];

//MY PAGINATION || calculation for my prev and next button
function paginate(array, page_size, page_number) {
  return array.slice((page_number - 1) * page_size, page_number * page_size);
}

function calculateTotalPages(totalItems, itemsPerPage) {
  return Math.ceil(totalItems / itemsPerPage);
}

//LOGIN
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

//SEARCH
app.post("/search", (req, res) => {
    const query = req.body.query.trim().toLowerCase();
    const results = studentlist.filter(student => {
        return student.idno.toLowerCase().includes(query) || student.lastname.toLowerCase().includes(query);
    });

    if (results.length > 0) {
        const totalPages = calculateTotalPages(results.length, display);
        const currentPage = 1;
        const paginatedResults = paginate(results, display, currentPage);
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

//DELETE
app.get("/deletestudent", (req, res) => {
  let idno = req.query.idno;
  let index = req.query.index;
  console.log("Deleting Student idno :" + idno);
  studentlist.splice(index, 1);
  let currentPage = parseInt(req.query.page) || 1; 
  let totalPages = Math.ceil(studentlist.length / display); 
  currentPage = Math.min(currentPage, totalPages);
  res.redirect(`/prevPage?page=${currentPage}`); 
});

// EDIT 
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

    let currentPage = parseInt(req.body.page) || 1; 
    let totalPages = Math.ceil(studentlist.length / display); 
    currentPage = Math.min(currentPage, totalPages);
    res.render("index.ejs", {
        header,
        studentlist: paginate(studentlist, display, currentPage),
    });
});

//ADD AND SAVE
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
  res.redirect(`/nextPage?page=${totalPages}`); 
});

//NEXT PAGE
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

//PREVIOUS PAGE
app.get("/prevPage", (req, res) => {
    let currentPage = parseInt(req.query.page) || 1; 
    let prevPage = Math.max(currentPage - 1, 1); 
    res.render("index.ejs", {
        header,
        studentlist: paginate(studentlist, display, prevPage),
        currentPage: prevPage, 
    });
});

//LOGOUT
app.get("/logout", (req, res) => {
  res.redirect("/");
});

app.get("/", (req, res) => {
  res.render("login.ejs", {users});
});

app.listen("4321", () => {
  console.log("listening at port 4321");
});