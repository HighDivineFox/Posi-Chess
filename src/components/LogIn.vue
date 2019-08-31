<template>
  <div class="wrapper">
      <div class="flex-row">
        <div class="title" :class="{active: mode == 'login'}" @mouseup="changeMode('login')">Sign In</div>
        <div class="title" :class="{active: mode == 'register'}" @mouseup="changeMode('register')">Register</div>
      </div>
      
      <div v-if="mode == 'login'" class="flex-col" @keyup.enter="logIn">
        <input type="email" name="email" id="email" placeholder="email" @keyup="clearStyle">
        <input type="password" name="password" id="password" placeholder="password">
        <input type="button" value="Sign In" @mouseup="logIn" class="submit">
      </div>

      <div v-if="mode == 'register'" class="flex-col" @keyup.enter="registerUser">
          <input type="text" name="reg-name" id="reg-name" placeholder="name">
          <input type="text" name="reg-username" id="reg-username" placeholder="username" @focus="usernameValidation" @keyup="usernameValidation">
          <input type="email" name="reg-email" id="reg-email" placeholder="email" @focus="emailValidation" @keyup="emailValidation">
          <input type="password" name="reg-password" id="reg-password" placeholder="password" @focus="passwordValidation" @keyup="passwordValidation">
          <input type="password" name="reg-confirm" id="reg-confirm" placeholder="confirm password" @focus="confirmValidation" @keyup="confirmValidation">
          <input type="button" value="Register" @mouseup="registerUser" class="submit">
      </div>

      <div v-for="(error, index) in errors" :key="index">
          {{error}}
      </div>
      
  </div>
</template>

<script>
import { getUser, userExists, createUser } from '../../Server_Functions/user_repository'
import VueCookies from 'vue-cookies'

/*
    name: {type: String},
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    rating: {type: Number, required: true},
    activeGames: {type: Array},
    gameHistory: {type: Array},
    savedPositions: {type: Object}
*/
var errorStyle = "border: 3px solid red; box-shadow: 0px 0px 2px red"

export default {
    data: function() {
        return {
            mode: "login",
            errors: []
        }
    },
    methods:{
        changeMode(mode){
            this.mode = mode
            this.errors = []
        },

        logIn(){
            let email = document.getElementById('email')
            let password = document.getElementById('password')

            if(!this.signInValidation(email, password)){
                console.log('Failed');
                return
            }

            if(this.errors.length > 0){
                console.log('Failed validation')
                return
            }

            let obj = {
                email: email.value,
                password: password.value
            }
            
            getUser(obj)
                .then((result) => {
                    if(result){
                        console.log("Log in successful");
                        console.log(result);

                        window.$cookies.config('10m')
                        window.$cookies.set('user', result)

                        window.location.href = "../"
                        
                    }else{
                        console.log("Log in unsuccessful: No result");
                    }
                })
                .catch((err) => {
                    console.log("Log in unsuccessful");    
                    console.log(err);
                                    
                })
        },

        registerUser(){
            let name = document.getElementById('reg-name')
            let username = document.getElementById('reg-username')
            let email = document.getElementById('reg-email')
            let password = document.getElementById('reg-password')
            let confirm = document.getElementById('reg-confirm')

            this.usernameValidation({target: username})
            this.emailValidation({target: email})
            this.passwordValidation({target: password})
            this.confirmValidation({target: confirm})

            if(this.errors.length == 0){
                let newUser = {}
                newUser['name'] = name.value || ""
                newUser['username'] = username.value
                newUser['email'] = email.value
                newUser['password'] = password.value

                createUser(newUser)
                    .then((result) => {
                        window.$cookies.set('user', result)
                        window.location.href = "../"
                    })
            }
        },

        usernameValidation(event){
            if(event.target.value.length < 4){
                event.target.setAttribute("style", errorStyle)
                if(this.errors.indexOf("Username must be at least 4 characters long") == -1){
                    this.errors.push("Username must be at least 4 characters long")
                }
            }else{
                this.clearStyle(event)
                this.errors = this.errors.filter(item => item != "Username must be at least 4 characters long")
            }
        },

        emailValidation(event){
            if(!event.target.validity.valid || event.target.value.length == 0){
                event.target.setAttribute("style", errorStyle)
                if(this.errors.indexOf("Please enter a valid email address") == -1){
                    this.errors.push("Please enter a valid email address")
                }
            }else{
                this.clearStyle(event)
                this.errors = this.errors.filter(item => item != "Please enter a valid email address")
            }
        },

        passwordValidation(event){
            if(event.target.value.length < 8){
                event.target.setAttribute("style", errorStyle)
                if(this.errors.indexOf("Password must be at least 8 characters long") == -1){
                    this.errors.push("Password must be at least 8 characters long")
                }
            }else{
                this.clearStyle(event)
                this.errors = this.errors.filter(item => item != "Password must be at least 8 characters long")
            }
        },

        confirmValidation(event){
            if(document.getElementById('reg-password').value != event.target.value){
                event.target.setAttribute("style", errorStyle)
                if(this.errors.indexOf("Passwords do not match") == -1){
                    this.errors.push("Passwords do not match")
                }
            }else{
                this.clearStyle(event)
                this.errors = this.errors.filter(item => item != "Passwords do not match")
            }
        },

        signInValidation(email, password){
            if(!email.validity.valid || email.value.length == 0){
                if(this.errors.indexOf("Please enter a valid email address") == -1){
                    email.setAttribute("style", errorStyle)
                    this.errors.push("Please enter a valid email address")
                }
                return false
            }    

            if(password.value.length == 0){
                if(this.errors.indexOf("Please enter a password") == -1){
                    password.setAttribute("style", errorStyle)
                    this.errors.push("Please enter a password")
                }
            }

            return true
        },

        clearStyle(event){
            event.target.setAttribute("style", "")
        }
    }
}
</script>

<style scoped>
    .wrapper{
        background-color: #f0f8ff;
        margin: 10px auto;
        padding: 10px;
        text-align: center;
        border-radius: 0em 0em 2em 2em;
        box-shadow: 1px 1px 1px 1px black;

        display: flex;
        flex-flow: column nowrap;
        justify-content: space-around;
        
        min-height: 150px;
        max-width: 600px;
    }

    input{
        padding: 5px;
        width: 50%;
        font-size: 110%;
    }

    .flex-row{
        display: flex;
        flex-flow: row nowrap;
        width: 100%;
        margin-bottom: 10px;
    }

    .flex-row > div{
        width: 100%;
        border-left: 1px solid black;
        border-right: 1px solid black;
    }

    .title{
        font-size: 200%;
        font-weight: bold;
        cursor: pointer;
    }

    .active{
        color: rgb(42, 141, 221);
    }

    .flex-col{
        display: flex;
        flex-flow: column nowrap;
        justify-content: space-between;
        align-items: center;
    }

    .flex-col > *{
        margin: 5px 0px;
    }

    .notValid{
        border: 1px solid red;
    }

    .submit{
        background-color: aliceblue;
        font-family: inherit;
        font-size: 150%;
        
        background-color: #d2eaff;
        box-shadow: 1px 1px 2px gray;
        border-radius: 0.3em;

        cursor: pointer;
    }

</style>