jQuery ($) ->
  $('#userLogin').on 'click', '.submit', () ->
    user = $('#userLogin .user').val()
    password = $('#userLogin .password').val()
    $.ajax {
      url : '/vicanso/admin/login',
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