(function() {

  jQuery(function($) {
    return $('#userLogin').on('click', '.submit', function() {
      var password, user;
      user = $('#userLogin .user').val();
      password = $('#userLogin .password').val();
      return $.ajax({
        url: '/vicanso/ajax/admin/login',
        type: 'post',
        data: {
          user: user,
          password: password
        },
        success: function() {
          return console.log('success');
        },
        error: function() {
          return console.log('error');
        }
      });
    });
  });

}).call(this);
