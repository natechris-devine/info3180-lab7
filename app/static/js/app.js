/* Add your Application JavaScript */
Vue.component('app-header', {
    template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
      <a class="navbar-brand" href="#">Lab 7</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
    
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <router-link class="nav-link" to="/">Home <span class="sr-only">(current)</span></router-link>
          </li>
          <li class="nav-item active">
            <router-link class="nav-link" to="/upload">Upload <span class="sr-only">(current)</span></router-link>
          </li>
        </ul>
      </div>
    </nav>
    `
});

Vue.component('app-footer', {
    template: `
    <footer>
        <div class="container">
            <p>Copyright &copy; Flask Inc.</p>
        </div>
    </footer>
    `
});

const Upload_Form = Vue.component('upload-form', {
    template: `
    <form id='uploadForm' @submit.prevent="uploadPhoto">
        <div id="alerts" class="alert">
            {{ msg }}
            <ul>
                <li v-for="err in errors">{{ err }}</li>
            </ul>
        </div>
        <div class="form-group">   
            <label for="description">Description:</label>
            <textarea name='description' class="form-control" rows="3" id="description"></textarea>
        </div>
        <div class="form-group">   
            <label for="photo">Select Photo:</label>
            <input type="file" accept="image/png, image/jpeg" class="form-control" id="photo" name="photo"></input>
        </div>
        <button type="submit" class="btn btn-primary">Submit</button>
     </form>
    `,
    methods: {
        uploadPhoto: function() {
            let uploadForm = document.getElementById('uploadForm');
            let form_data = new FormData(uploadForm);
            let msg_area = document.getElementById("alerts");

            fetch("/api/upload", {
                method: 'POST',
                body: form_data,
                headers: {
                    'X-CSRFToken': token
                },
                credentials: 'same-origin'
            })
            .then(response => {
                return response.json();
            })
            .then(jsonResponse => {
                console.log(jsonResponse);
                if(jsonResponse.hasOwnProperty('message')) {
                    this.msg = jsonResponse['message'];
                    this.errors = []
                    msg_area.classList.add("alert-success");
                    msg_area.classList.remove("alert-danger");
                } else {
                    this.errors = jsonResponse['errors'];
                    this.msg = "";
                    msg_area.classList.add("alert-danger");
                    msg_area.classList.remove("alert-success");
                }
            })
            .catch(error => {
                this.errors = error;
            });

            msg_area.style.display = "block";
        }

    },
    data: function() {
        return {
            msg: "",
            errors: []
        }
    },
    mounted: function() {
        document.getElementById("alerts").style.display = "none";
    }
});

const Home = Vue.component('home', {
   template: `
    <div class="jumbotron">
        <h1>Lab 7</h1>
        <p class="lead">In this lab we will demonstrate VueJS working with Forms and Form Validation from Flask-WTF.</p>
    </div>
   `,
    data: function() {
       return {}
    }
});

const NotFound = Vue.component('not-found', {
    template: `
    <div>
        <h1>404 - Not Found</h1>
    </div>
    `,
    data: function () {
        return {}
    }
})

// Define Routes
const router = new VueRouter({
    mode: 'history',
    routes: [
        {path: "/", component: Home},
        // Put other routes here
        {path: "/upload", component: Upload_Form},

        // This is a catch all route in case none of the above matches
        {path: "*", component: NotFound}
    ]
});

// Instantiate our main Vue Instance
let app = new Vue({
    el: "#app",
    router
});