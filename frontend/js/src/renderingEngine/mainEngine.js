window.toggle = () => { 
    if(document.getElementById('login').style.display=='none') { 
        document.getElementById('login').style.display='block'; 
    } 
    else if (document.getElementById('login').style.display=='block') { 
        document.getElementById('login').style.display='none'; 
    } 
    if(document.getElementById('signUp').style.display=='none') { 
        document.getElementById('signUp').style.display='block'; 
    } 
    else if (document.getElementById('signUp').style.display=='block') { 
        document.getElementById('signUp').style.display='none'; 
    }
    return false;
}

window.hideAuth = () => {

    document.getElementById('login').style.display='none';
    document.getElementById('signUp').style.display='none';
}

export default {
    toggle, 
    hideAuth
}