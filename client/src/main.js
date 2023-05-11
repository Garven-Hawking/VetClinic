$(function (){

    $('.team_slider').slick({
        //dots: true,
        infinite: false,
        arrows:true,
        slidesToShow: 2,
        slidesToScroll: 1,
    });

    $('#authorization_button').on("click", function (){
        $('#authorization_modal').addClass("open")
    })

    $('#authorization_modal_close_button').on("click", function (){
        $('#authorization_modal').removeClass("open")
    })

    let changeAuthorizationModalActiveTab = function (buttonToMakeActive, buttonToRemoveActive, makePopupBodySignup, text){
        if (buttonToMakeActive.hasClass("active")){
            return;
        }
        if(makePopupBodySignup){
            $('.popup_body').addClass("signup")
            $('.popup_form').prepend('<input id="signup_form_input" class="popup_input" type="text" placeholder="Введите логин" name="username" <br>')
            $('.popup_form').prepend('<label id="signup_form_label" class="popup_label">Логин<br></label>')
            $('#authorization_type').val("signup")
        }else {
            $('.popup_body').removeClass("signup")
            $('#signup_form_input').remove()
            $('#signup_form_label').remove()
            $('#authorization_type').val("login")
        }
        buttonToRemoveActive.removeClass("active")
        buttonToMakeActive.addClass("active")
        $('#authorization_confirm_button').html(text)
    }

    $('#login_tab_button').on("click", function (){
        changeAuthorizationModalActiveTab($('#login_tab_button'),
            $('#signup_tab_button'), false,"Войти")
    })

    $('#signup_tab_button').on("click", function (){
        changeAuthorizationModalActiveTab($('#signup_tab_button'),
            $('#login_tab_button'), true,"Зарегистрироваться")
    })

    $('.popup_form').on("submit", async function () {
        let form = $(this)
        let headers = {
            //'Content-Type': 'application/json'
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        let response = await fetch("/authorization", {
            method: "POST",
            body: form.serialize(),
            headers: headers
        })
        let json = await response.json()
        const {message} = json;
        const {token} = json
        if (response.status === 200) {
            document.cookie = `token=${token}`
            window.location.href = 'clientPage'
        } else {
            console.log(message)
        }
    })

})