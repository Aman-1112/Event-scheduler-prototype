//frontend logic
// import { showAlert } from "./showAlert";

// const {showAlert}=require('./showAlert');
//? neither import nor require is working 
//? why does it need a bundler to work properly

/***************** Delete By Organiser******************/

function deleteConfirmation(ele){
    let modalData={
        title: 'Confirmation',
        content: 'Are you sure you want to delete this event?'
    };

    let modal = document.querySelector('.modal');
    modal.style.display="block";

    let modalContent = document.querySelector('.modal-content');
    modalContent.querySelector('h2').textContent=modalData.title;
    modalContent.querySelector('p').textContent=modalData.content;

    let confirmBtn=modal.querySelector('#confirm');
    confirmBtn.textContent='Delete';
    confirmBtn.style.backgroundColor="#f44336";
    confirmBtn.addEventListener('click',()=>{
        deleteEventByOrganiser(ele);
        removeModal();
    })
}
const deleteEventByOrganiser = async (ele)=>{
    let eventId = ele.getAttribute('event-id')
    try {
        const response = await fetch(`/api/v1/event/${eventId}`,{
            method:'DELETE'
        })
        console.log("delete response=",response)
        if(response.status===204){
            showAlert('success','Event Deleted Successfully');
            setTimeout(()=>{
                location.assign('/')
            },1000)
        }else{
            showAlert('error',response.error);
        }
    } catch (err) {
        console.log(err);
        showAlert('error',err.message)
    }
}
/****************************************************************/


function getCity(){
    console.log("get city was called");
    let selectedCity = document.querySelector('#list-of-city').value;
    location.href = `${location.origin}?venue.city=${selectedCity}`;  
}
/*********************from Outsource***************************/
// window.onscroll = function() {
//     console.log("FROM Saving SCROLL POSITION",window.pageYOffset);
//     sessionStorage.setItem('scrollPos', window.pageYOffset);
// };

// window.onload = function() {
//     console.log("FROM SETTING SCROLL POSITION",window.pageYOffset);
//     var scrollPos = sessionStorage.getItem('scrollPos');
//     if (scrollPos) {
//         smoothScrollToY(scrollPos,1000)
//     //   window.scrollTo(0, scrollPos);
//       sessionStorage.removeItem('scrollPos');
//     }
// };

// function smoothScrollToY(targetY, duration) {
//     const startY = window.pageYOffset;
//     const distanceY = targetY - startY;
//     let startTime = null;
  
//     function step(timestamp) {
//       if (!startTime) startTime = timestamp;
//       const progress = timestamp - startTime;
//       const ease = easeInOutQuart(progress, 0, 1, duration);
//       window.scrollTo(0, startY + distanceY * ease);
//       if (progress < duration) window.requestAnimationFrame(step);
//     }
  
//     window.requestAnimationFrame(step);
// }
  
// function easeInOutQuart(t, b, c, d) {
// t /= d / 2;
// if (t < 1) return c / 2 * t * t * t * t + b;
// t -= 2;
// return -c / 2 * (t * t * t * t - 2) + b;
// }
/**********************************************************************/ 

const hideAlert = ()=>{
    const el = document.querySelector('.alert');
    if(el){
        el.parentElement.removeChild(el);
    }
}

const showAlert =(status,message)=>{
    const html = `<div class="alert ${status}-alert"><p>${message}</p></div>`;
    // document.querySelector('body').insertAdjacentHTML('beforebegin',html);
    document.querySelector('body').insertAdjacentHTML('beforebegin',html);
    setTimeout(()=>{
        hideAlert();
    },2000)
}


const loginRequest = async(email,password)=>{
    try {
        const res = await fetch('/api/v1/users/login',{
            method:'POST',
            headers:{
                'Content-Type':'application/json;charset=utf-8'
            },
            body:JSON.stringify({
                email,
                password
            })
        });
        const response = await res.json();
        if(response.status==='success'){
            showAlert('success','logged in successfully');
            setTimeout(()=>{
                location.assign('/')
            },1000)
        }
        else if(response.status==='fail'){
            showAlert('error',response.error);
        }
    } catch (err) {
        console.error(err);
        showAlert('error',err.message)
    }
}

const SignupRequest =async (data)=>{
    try {
        const res = await fetch('/api/v1/users/signup',{
            method:'POST',
            body:data
            // body:JSON.stringify({
            //     name,email,password,confirmPassword,gender,role
            // })
        })
        const response = await res.json();
        console.log(response);
        if(response.status==='success'){
            showAlert('success','Signed in successfully');
            setTimeout(()=>{
                location.assign('/')
            },1000)
        }
        else if(response.status==='fail'){
            showAlert('error',response.error);
        }
    } catch (err) {
        console.error(err);
        showAlert('error',err.message);
    }
}


if(document.querySelector('.login-form')){
    document.querySelector('.login-form').addEventListener('submit',e=>{
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        loginRequest(email,password);
    })
}

if(document.querySelector('.logout-btn')){
    document.querySelector('.logout-btn').addEventListener('click',async()=>{
        const res = await fetch('/api/v1/users/logout',{
                method:'GET',
                headers:{
                    'Content-Type':'application/json'
                }
            });
        const response = await res.json();
        if(response.status==='success'){            
            location.assign('/');
        }
    })
}

function passwordValidate(value) {
    const password = value;
    
    // Define your password criteria here
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*]/.test(password);
    
    
    // Update the criteria messages
    document.getElementById('length-criteria').style.color = password.length >= minLength ? 'green' : 'red';
    document.getElementById('uppercase-criteria').style.color = hasUppercase ? 'green' : 'red';
    document.getElementById('lowercase-criteria').style.color = hasLowercase ? 'green' : 'red';
    document.getElementById('number-criteria').style.color = hasNumber ? 'green' : 'red';
    document.getElementById('special-char-criteria').style.color = hasSpecialChar ? 'green' : 'red';
}
const passwordInput = document.getElementById('signup-password');
if(passwordInput ){
    passwordInput.addEventListener('input',()=>passwordValidate(passwordInput.value));
}

const newPasswordInput = document.getElementById('reset-new-password');
if(newPasswordInput){
    newPasswordInput.addEventListener('input',()=>passwordValidate(newPasswordInput.value));
}

const newPasswordInputProfile = document.getElementById('new-password')
if(newPasswordInputProfile){
    newPasswordInputProfile.addEventListener('input',()=>passwordValidate(newPasswordInputProfile.value))
}

if(document.querySelector('.signup-form')){
    document.querySelector('.signup-form').addEventListener('submit',e=>{
        e.preventDefault();
        let password=document.getElementById('signup-password').value;
        let cpassword=document.getElementById('signup-confirm-password').value;
        
        if(password!=cpassword){
            showAlert('error','The Password and confirm password did not match')
            return
        }
        
        const formdata=new FormData();
        formdata.append("name",document.getElementById('signup-name').value);
        formdata.append("email",document.getElementById('signup-email').value);
        formdata.append("password",password);
        formdata.append("confirmPassword",cpassword);
        formdata.append("role",document.getElementById('signup-as').value);
        formdata.append("photo",document.getElementById('signup-photo').files[0]);

        const male=document.getElementById('gender-male').checked;
        let gender;
        if(male) gender='male';
        else gender='female';
        formdata.append("gender",gender);

        SignupRequest(formdata);
    })
}

if(document.querySelector('#forgot-password-form')){
    document.querySelector('#forgot-password-form').addEventListener('submit',async(e)=>{
        let resetButton = document.querySelector('#reset-link-btn');
        try {
            e.preventDefault();
            resetButton.textContent='Sending...';
            const email = document.getElementById('reset-email').value;
            const res =await fetch('/api/v1/users/forgotPassword',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    email
                })
            })
            const response = await res.json();
            console.log(response);
            if(response.status==='success'){
                let resetBtn=document.querySelector('#reset-link-btn');
                resetBtn.parentElement.insertAdjacentHTML('afterbegin','<p class=\'reset-link-msg\'>'+response.message.charAt(0).toUpperCase()+response.message.slice(1)+' !!!</p>');
                document.getElementById('reset-email').value='';
            }else{
                showAlert('error',response.error);
            }
        } catch (err) {
            console.error(err);
            showAlert('error',err.error);
        }
        resetButton.textContent='Send reset link';
    })
}

if(document.getElementById('reset-form')){
    document.getElementById('reset-form').addEventListener('submit',async(e)=>{
        try {
            e.preventDefault();
            const total = window.location.href.split('/').length;
            const resetToken = window.location.href.split('/')[total-1];

            const newPassword = document.getElementById('reset-new-password').value;
            const newConfirmPassword = document.getElementById('reset-confirm-new-password').value;
            const res =await fetch(`/api/v1/users/resetPassword/${resetToken}`,{
                method:'PATCH',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    password:newPassword,
                    confirmPassword:newConfirmPassword
                })
            })
            const response = await res.json();
            console.log(response);
            if(response.status==='success'){
                showAlert('success','Password Reset Successfully');
                setTimeout(()=>{
                    location.assign('/');
                },1000)
            }else{
                showAlert('error',response.message);
            }
        } catch (err) {
            console.error(err);
            showAlert('error',err.message);
        }
    })
}


/***************************************profile page*********************************/
function tab_selector(ele,className){
    console.log(ele);
    //or can search by classname and remove it
    if(document.querySelector('.active'))
    document.querySelector('.active').classList.remove('active');
    
    //hiding all tab content
    document.querySelectorAll('.tab-content').forEach((tb)=>{
        tb.style.display='none';
    })

    ele.classList.add('active');

    document.querySelector(`.${className}`).style.display='flex';
    document.querySelector(`.${className}`).style.flexDirection='column';
    document.querySelector(`.${className}`).style.textAlign='start';
}

async function deleteMyAccount(){
    console.log('delete account successfully');
            const password =document.querySelector('#del-acc-form #del-password').value;
                    // try {
                        const res =await fetch('/api/v1/users/deleteMyAccount',{
                            method:'DELETE',
                            headers:{
                                "Content-Type":"application/json"
                            },
                            body:JSON.stringify({
                                password
                            })
                        })

                        //? Some Different Response than expected
                        if(res.status===204)
                            location.assign('/');

                        else{
                            let response = await res.json();
                            console.log(response.message);
                            showAlert('error',response.message)
                        }
}

if(document.querySelector('#update-pass-form'))
    document.querySelector('#update-pass-form').addEventListener('submit',async(e)=>{
        e.preventDefault();
        console.log('update with new password');

        let current_password=document.querySelector('#update-pass-form #current-password').value;
        let new_password=document.querySelector('#update-pass-form #new-password').value;
        let new_confirmPassword=document.querySelector('#update-pass-form #new-cofirm-password').value;

        try {
            const res = await fetch('/api/v1/users/updateMyPassword',{
                method:'PATCH',
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    current_password,
                    new_password,
                    new_confirmPassword
                })
            })
            const response = await res.json();
            console.log("response",response);
            if(response.status==='success'){
                showAlert('success','Password Updated Successfully');
                setTimeout(()=>{
                    location.assign('/profile');
                },1000)
            }else{
                showAlert('error',response.message);
            }
        } catch (err) {
            console.error(err);
            showAlert('error',err.message);
        }
})


if(document.querySelector('#update-detail-form')){
    document.querySelector('#update-detail-form').addEventListener('submit',async(e)=>{
        e.preventDefault();
        console.log('update the details');

        const formdata = new FormData();
        formdata.append("name",document.querySelector('#update-detail-form #name').value);
        formdata.append("email",document.querySelector('#update-detail-form #email').value);

        let photo = document.querySelector('#update-detail-form #update-photo').files[0];
        if(photo)formdata.append("photo",photo);

        let male=document.querySelector('#update-detail-form #gender-male').checked;
        let gender;
        if(male)gender='male';
        else gender='female';
        formdata.append("gender",gender);

        try {
            const res = await fetch('/api/v1/users/updateMyDetails',{
                method:'PATCH',
                body:formdata
            })
            const response = await res.json();
            console.log("response",response);
            if(response.status==='success'){
                showAlert('success','Details Updated Successfully');
                // setTimeout(()=>{
                //     location.assign('/profile');
                // },1500)
            }else{
                showAlert('error',response.message);
            }
        } catch (err) {
            console.error(err);
            showAlert('error',err.message);
        }
    })
}

/**********************************************Create/Update Event Form********************************************/
if(document.querySelector('#create-event')){
    document.querySelector('#create-event').addEventListener('submit',async(e)=>{
        e.preventDefault();

        const formdata = new FormData();
        formdata.append("title",document.querySelector('#create-event #title').value);
        formdata.append("photo",document.querySelector('#create-event #event-photo').files[0]);
        formdata.append("description",document.querySelector('#create-event #description').value);
        formdata.append("entryFee",document.querySelector('#create-event #entryfee').value);
        formdata.append("start",document.querySelector('#create-event #startdate').value);
        formdata.append("end",document.querySelector('#create-event #enddate').value);
        formdata.append("street",document.querySelector('#create-event #street').value);
        formdata.append("city",document.querySelector('#create-event #city').value);
        formdata.append("state",document.querySelector('#create-event #state').value);
        if(document.querySelector('#create-event #guestlimit')){
            formdata.append("maxGuestLimit",document.querySelector('#create-event #guestlimit').value);
        }
        // let street=document.querySelector('#create-event #street').value;
        // let city=document.querySelector('#create-event #city').value;
        // let state=document.querySelector('#create-event #state').value
        // formdata.append("venue",JSON.stringify({
        //     street,city,state
        // }))

        try {
            const res = await fetch('/api/v1/events',{
                method:'POST',
                body:formdata
            })
            const response = await res.json();
            console.log("response from create event ",response);
            if(response.status==='success'){
                showAlert('success','Event Created Successfully');
                setTimeout(()=>{
                    location.assign('/');
                },1000)
            }else{
                showAlert('error',response.error);
            }
        } catch (err) {
            console.error(err);
            showAlert('error',err.message);
        }
    })
}

if(document.querySelector('#update-event')){
    document.querySelector('#update-event').addEventListener('submit',async(e)=>{
        e.preventDefault();

        const formdata = new FormData();

        formdata.append("title",document.querySelector('#update-event #title').value);
        if(document.querySelector('#update-event #event-photo').files[0])
            formdata.append("photo",document.querySelector('#update-event #event-photo').files[0]);
        formdata.append("description",document.querySelector('#update-event #description').value);
        formdata.append("entryFee",document.querySelector('#update-event #entryfee').value);
        formdata.append("start",document.querySelector('#update-event #startdate').value);
        formdata.append("end",document.querySelector('#update-event #enddate').value);
        formdata.append("street",document.querySelector('#update-event #street').value);
        formdata.append("city",document.querySelector('#update-event #city').value);
        formdata.append("state",document.querySelector('#update-event #state').value);
        if(document.querySelector('#update-event #guestlimit')){
            formdata.append("maxGuestLimit",document.querySelector('#update-event #guestlimit').value);
        }

        const eventId = location.pathname.split('/')[2];
        try {
            const res = await fetch(`/api/v1/event/${eventId}`,{
                method:'PATCH',
                body:formdata
            })
            const response = await res.json();
            console.log("response from update event ",response);
            if(response.status==='success'){
                showAlert('success','Event Updated Successfully');
                setTimeout(()=>{
                    location.assign('/');
                },1000)
            }else{
                showAlert('error',response.error);
            }
        } catch (err) {
            console.error(err);
            showAlert('error',err.message);
        }
    })
}




/*********************************************************--STRIPE--INTEGRATION--*********************************************************/
const stripe = window.Stripe('pk_test_51Mp8evSArVGJy6HVla9ZZQRUVHTbzkgfmBZJZem0E6gv8MjZ2KTiM82xPipCQeOVFjgwOf77MCo1XNWHw8VzeSDy00jmyHvrut')

const gettingCheckoutSession=async(eventId)=>{
    try {
        const res = await fetch(`/api/v1/checkout-session/${eventId}`);
        const response = await res.json();
        console.log(response);

        //using session charging the card
        await stripe.redirectToCheckout({
            sessionId:response.response.id
        })
        
        
    } catch (err) {
        console.error(err);
    }
}

const bookBtn=document.getElementById('event-book-btn');
if(bookBtn){
    // const eventId=location.href.substring(location.href.lastIndexOf('/') + 1);
    let eventId=bookBtn.getAttribute('data-event-id');

    bookBtn.addEventListener('click',async ()=>{
        try {
            bookBtn.textContent = 'Booking...';
            
            //PAYMENT
            gettingCheckoutSession(eventId);

            //BOOKED
        } catch (err) {
            console.error(err);
            showAlert('error',err.message);
        }
    })
}

/*****************************************tabs for different categories in home*******************************************/
function getRequested(ele,url){
    console.log("From getRequested",window.location.origin);
    console.log(window.location.origin+url);

    location.href=window.location.origin+url;
}
//temporary solution
(function setActiveTab(){
    let url = window.location.href;
    if(url.includes('?end[lt]')){
        document.querySelector("[data-id=expired]").classList.add('active');
    }
    else if(url.includes('?entryFee=0')){
        document.querySelector("[data-id=free]").classList.add('active');
    }
    else if(url.includes('?end[gt]')){
        document.querySelector("[data-id=upcoming]").classList.add('active');
    }
    else{
        // document.querySelector("[data-id=all]").classList.add('active');
    }
})()

const togglebuttons=document.querySelectorAll('.toggle-password')

togglebuttons.forEach(function(button){
    button.addEventListener('click',function(){
        targetName=this.getAttribute('data-target')
        targetElm=document.getElementById(targetName)
        iconEle=this.querySelector('i')
        if(targetElm){
            if(targetElm.type==='password'){
                targetElm.type='text'
                iconEle.classList.add('fa-eye')
                iconEle.classList.remove('fa-eye-slash')
            }else{
                targetElm.type='password'
                iconEle.classList.add('fa-eye-slash')
                iconEle.classList.remove('fa-eye')
            }
        }
    })
})
//   const passwordInput = document.getElementById('signup-password');
//   const toggleButton = document.querySelector('.toggle-password');
//   if(passwordInput && toggleButton){
//       toggleButton.addEventListener('click', function () {
//         if (passwordInput.type === 'password') {
//           passwordInput.type = 'text'; 
//         } else {
//           passwordInput.type = 'password';
//         }
//       });
//   }

/*************************************************Modal******************* */
if(document.querySelector('#del-acc-form')){
    console.log("Added the eventlistener")
    document.querySelector('#del-acc-form').addEventListener('submit',(e)=>{

        e.preventDefault();

        let modalData={
            title: 'Confirmation',
            content: 'Are you sure you want to delete your account?'
        };

        let modal = document.querySelector('.modal');
        modal.style.display="block";

        let modalContent = document.querySelector('.modal-content');
        modalContent.querySelector('h2').textContent=modalData.title;
        modalContent.querySelector('p').textContent=modalData.content;

        let confirmBtn=modal.querySelector('#confirm');
        confirmBtn.textContent='Delete';
        confirmBtn.style.backgroundColor="#f44336";
        confirmBtn.addEventListener('click',()=>{
            deleteMyAccount();
            removeModal();
        })
    })
}

function removeModal(){
    console.log("removing modal...")

    let modal = document.querySelector('.modal');
    modal.style.display="none";

    let confirmBtn=modal.querySelector('#confirm');
    confirmBtn.textContent='Confirm';
    confirmBtn.removeEventListener('click',()=>{
        deleteMyAccount();
        removeModal();
    })
    confirmBtn.style.backgroundColor="#007bff";

}

const closeModal=document.querySelector('#close-modal');
if(closeModal){
    closeModal.addEventListener('click',()=>removeModal())
}

const cancelModal=document.querySelector('#cancel');
if(cancelModal){
    cancelModal.addEventListener('click',()=>removeModal())
}


if(window.location.href.includes('venue.city'))
{
    let city = window.location.href.split('=')[1];
    document.querySelectorAll('#city-option').forEach(ele=>{
        if(ele.getAttribute('value')===city){
            ele.setAttribute('selected',true)
        }
    })
}