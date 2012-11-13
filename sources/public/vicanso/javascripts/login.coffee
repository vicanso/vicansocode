jQuery ($) ->
  $('#userLogin').on 'click', '.submit', () ->
    user = $('#userLogin .user').val()
    password = $('#userLogin .password').val()
    password = CryptoJS.SHA1(password).toString()
    $.ajax {
      url : '/vicanso/ajax/admin/login',
      type : 'post'
      data : {
        user : user
        password : password
      }
      success : () ->
        console.log 'success'
      error : () ->
        console.log 'error'
    }